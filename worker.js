import html from './index.html';
import css from './styles.css';
import js from './script.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Serve static files
    if (url.pathname === '/') {
      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    }
    if (url.pathname === '/styles.css') {
      return new Response(css, { headers: { 'Content-Type': 'text/css' } });
    }
    if (url.pathname === '/script.js') {
      return new Response(js, { headers: { 'Content-Type': 'application/javascript' } });
    }

    // Handle API requests
    if (url.pathname === '/api/generate' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { model, prompt, negative_prompt, width, height, steps, guidance, seed } = body;

        if (!model || !prompt) {
          return Response.json({ error: 'Model and prompt are required' }, { status: 400 });
        }

        // Prepare inputs for Workers AI
        const inputs = {
          prompt,
          negative_prompt,
          width,
          height,
          num_steps: steps,
          guidance,
          seed
        };

        // Run the model
        const response = await env.AI.run(model, inputs);

        // Handle different response types
        // SDXL Lightning returns binary
        if (model === '@cf/bytedance/stable-diffusion-xl-lightning') {
            // Convert binary to base64
            const binaryString = await new Response(response).arrayBuffer();
            const base64Image = btoa(String.fromCharCode(...new Uint8Array(binaryString)));
            return Response.json({ image: base64Image });
        } 
        
        // FLUX models return JSON with image property
        if (response.image) {
            return Response.json({ image: response.image });
        }

        return Response.json(response);

      } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }

    return new Response('Not Found', { status: 404 });
  }
};
