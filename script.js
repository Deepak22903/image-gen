// DOM Elements
const form = document.getElementById('imageForm');
const generateBtn = document.getElementById('generateBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');
const placeholder = document.getElementById('placeholder');
const resultContainer = document.getElementById('resultContainer');
const errorContainer = document.getElementById('errorContainer');
const generatedImage = document.getElementById('generatedImage');
const errorMessage = document.getElementById('errorMessage');
const downloadBtn = document.getElementById('downloadBtn');
const newImageBtn = document.getElementById('newImageBtn');
const retryBtn = document.getElementById('retryBtn');

// Range inputs
const stepsInput = document.getElementById('steps');
const stepsValue = document.getElementById('stepsValue');
const guidanceInput = document.getElementById('guidance');
const guidanceValue = document.getElementById('guidanceValue');

// Update range values
stepsInput.addEventListener('input', (e) => {
    stepsValue.textContent = e.target.value;
});

guidanceInput.addEventListener('input', (e) => {
    guidanceValue.textContent = e.target.value;
});

// Model selection - adjust max steps based on model
const modelSelect = document.getElementById('model');
modelSelect.addEventListener('change', (e) => {
    const model = e.target.value;
    if (model === '@cf/bytedance/stable-diffusion-xl-lightning') {
        stepsInput.max = 20;
    } else if (model === '@cf/black-forest-labs/flux-1-schnell') {
        stepsInput.max = 8;
        if (parseInt(stepsInput.value) > 8) {
            stepsInput.value = 8;
            stepsValue.textContent = 8;
        }
    } else {
        stepsInput.max = 20;
    }
});

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await generateImage();
});

// Generate Image Function
async function generateImage() {
    // Get form data
    const formData = new FormData(form);
    const data = {
        model: formData.get('model'),
        prompt: formData.get('prompt'),
        width: parseInt(formData.get('width')),
        height: parseInt(formData.get('height')),
        steps: parseInt(formData.get('steps')),
        guidance: parseFloat(formData.get('guidance'))
    };

    // Add optional fields
    if (formData.get('negative_prompt')) {
        data.negative_prompt = formData.get('negative_prompt');
    }
    if (formData.get('seed')) {
        data.seed = parseInt(formData.get('seed'));
    }

    // UI State: Loading
    setLoadingState(true);
    hideResults();

    try {
        // Call backend API
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to generate image');
        }

        // Display the generated image
        displayImage(result.image);

    } catch (error) {
        console.error('Error:', error);
        showError(error.message);
    } finally {
        setLoadingState(false);
    }
}

// Display generated image
function displayImage(base64Image) {
    placeholder.style.display = 'none';
    errorContainer.style.display = 'none';
    resultContainer.style.display = 'flex';
    
    // Create data URI
    const dataURI = `data:image/png;base64,${base64Image}`;
    generatedImage.src = dataURI;
    generatedImage.dataset.image = base64Image;
}

// Show error
function showError(message) {
    placeholder.style.display = 'none';
    resultContainer.style.display = 'none';
    errorContainer.style.display = 'block';
    errorMessage.textContent = message;
}

// Hide all results
function hideResults() {
    placeholder.style.display = 'none';
    resultContainer.style.display = 'none';
    errorContainer.style.display = 'none';
}

// Set loading state
function setLoadingState(isLoading) {
    if (isLoading) {
        generateBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-flex';
    } else {
        generateBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// Download image
downloadBtn.addEventListener('click', () => {
    const base64Image = generatedImage.dataset.image;
    const dataURI = `data:image/png;base64,${base64Image}`;
    
    // Create download link
    const link = document.createElement('a');
    link.href = dataURI;
    link.download = `ai-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Generate new image
newImageBtn.addEventListener('click', () => {
    resultContainer.style.display = 'none';
    placeholder.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
});

// Retry after error
retryBtn.addEventListener('click', () => {
    errorContainer.style.display = 'none';
    placeholder.style.display = 'block';
    generateImage();
});

// Add some example prompts for inspiration
const examplePrompts = [
    'a cyberpunk cat in a neon city, digital art',
    'a majestic mountain landscape at sunset, photorealistic',
    'a futuristic spaceship in deep space, sci-fi concept art',
    'a cozy coffee shop interior, warm lighting, detailed',
    'a fantasy dragon flying over a castle, epic scene'
];

// Add example prompt on page load hint
const promptInput = document.getElementById('prompt');
let exampleIndex = 0;

promptInput.addEventListener('focus', function() {
    if (!this.value) {
        this.placeholder = examplePrompts[exampleIndex];
        exampleIndex = (exampleIndex + 1) % examplePrompts.length;
    }
}, { once: false });

// Keyboard shortcut: Ctrl/Cmd + Enter to generate
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!generateBtn.disabled) {
            generateImage();
        }
    }
});

console.log('🎨 AI Image Generator ready!');
console.log('💡 Tip: Press Ctrl/Cmd + Enter to generate');
