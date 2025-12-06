require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Cloudflare API credentials
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
    console.error('⚠️  Missing Cloudflare credentials in .env file');
    console.error('Please set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN');
}

// API endpoint for image generation
app.post('/api/generate', async (req, res) => {
    try {
        const { model, prompt, negative_prompt, width, height, steps, guidance, seed } = req.body;

        // Validate required fields
        if (!model || !prompt) {
            return res.status(400).json({ error: 'Model and prompt are required' });
        }

        console.log(`🎨 Generating image with ${model}...`);
        console.log(`📝 Prompt: ${prompt}`);

        // Prepare request body based on model
        let requestBody;
        let apiUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`;

        // Different models have different APIs
        if (model === '@cf/black-forest-labs/flux-2-dev') {
            // FLUX.2 uses multipart/form-data
            // Use native FormData (Node.js 18+)
            const form = new FormData();
            
            form.append('prompt', prompt);
            if (width) form.append('width', width.toString());
            if (height) form.append('height', height.toString());
            if (steps) form.append('steps', steps.toString());
            if (seed) form.append('seed', seed.toString());

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`
                },
                body: form
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Cloudflare API Error:', errorText);
                return res.status(response.status).json({ 
                    error: `API Error: ${response.statusText}` 
                });
            }

            const result = await response.json();
            const image = result.image || (result.result && result.result.image);
            
            if (!image) {
                console.error('❌ No image in response:', JSON.stringify(result).substring(0, 200));
                return res.status(500).json({ error: 'No image data received from API' });
            }

            console.log('✅ Image generated successfully');
            return res.json({ image: image });

        } else {
            // FLUX.1 Schnell and SDXL Lightning use JSON
            requestBody = { prompt };

            if (negative_prompt) requestBody.negative_prompt = negative_prompt;
            if (width) requestBody.width = width;
            if (height) requestBody.height = height;
            if (steps) requestBody.num_steps = steps;
            if (guidance) requestBody.guidance = guidance;
            if (seed) requestBody.seed = seed;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Cloudflare API Error:', errorText);
                return res.status(response.status).json({ 
                    error: `API Error: ${response.statusText}` 
                });
            }

            // For SDXL Lightning, response is binary image
            if (model === '@cf/bytedance/stable-diffusion-xl-lightning') {
                const imageBuffer = await response.arrayBuffer();
                const base64Image = Buffer.from(imageBuffer).toString('base64');
                console.log('✅ Image generated successfully');
                return res.json({ image: base64Image });
            } else {
                // For FLUX.1 Schnell, response is JSON with base64 image
                const result = await response.json();
                const image = result.image || (result.result && result.result.image);
                
                if (!image) {
                    console.error('❌ No image in response:', JSON.stringify(result).substring(0, 200));
                    return res.status(500).json({ error: 'No image data received from API' });
                }

                console.log('✅ Image generated successfully. Length:', image.length);
                return res.json({ image: image });
            }
        }

    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ 
            error: 'Failed to generate image. Please try again.' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        hasCredentials: !!(CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_API_TOKEN)
    });
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log('');
    console.log('🎨 AI Image Generator Server');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌐 Server running at: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log('');
    if (CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_API_TOKEN) {
        console.log('✅ Cloudflare credentials loaded');
    } else {
        console.log('⚠️  Warning: Missing Cloudflare credentials');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
});
