# 🎨 AI Image Generator

A modern web application for generating images using Cloudflare Workers AI. Supports multiple state-of-the-art models including FLUX.1 Schnell, FLUX.2 Dev, and SDXL Lightning.

![AI Image Generator](https://img.shields.io/badge/AI-Image%20Generation-blue)
![Cloudflare Workers AI](https://img.shields.io/badge/Cloudflare-Workers%20AI-orange)

## ✨ Features

- 🤖 **Multiple AI Models**: Choose from FLUX.1 Schnell, FLUX.2 Dev, or SDXL Lightning
- ⚡ **Fast Generation**: Lightning-fast image generation with optimized models
- 🎨 **Advanced Controls**: Fine-tune your images with steps, guidance, dimensions, and more
- 📱 **Responsive Design**: Beautiful UI that works on desktop and mobile
- 💾 **Easy Download**: Download generated images with one click
- 🔄 **Real-time Preview**: See your images instantly after generation

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- A Cloudflare account with Workers AI access
- Cloudflare API Token

### Installation

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Cloudflare credentials:
   ```env
   CLOUDFLARE_ACCOUNT_ID=your_account_id_here
   CLOUDFLARE_API_TOKEN=your_api_token_here
   PORT=3000
   ```

### Getting Cloudflare Credentials

1. **Account ID**:
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Select your account
   - Copy the Account ID from the right sidebar

2. **API Token**:
   - Go to [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - Click "Create Token"
   - Use the "Workers AI" template or create a custom token with:
     - Workers AI Read/Write permissions
     - Account Resources: Include your account
   - Copy and save the token securely

### Running the Application

1. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

2. **Open your browser**
   
   Navigate to: `http://localhost:3000`

## 🎯 Usage

1. **Select a Model**: Choose from the available AI models in the dropdown
2. **Enter Your Prompt**: Describe the image you want to generate
3. **Adjust Settings** (Optional): Expand "Advanced Options" to fine-tune:
   - Negative prompt (what to avoid)
   - Image dimensions (width/height)
   - Steps (quality vs speed)
   - Guidance (prompt adherence)
   - Seed (reproducibility)
4. **Generate**: Click "Generate Image" or press Ctrl/Cmd + Enter
5. **Download**: Save your generated image

## 🤖 Available Models

### FLUX.1 Schnell (Fast)
- **Speed**: Ultra-fast generation (1-8 steps)
- **Quality**: High quality at 1024px
- **Best for**: Quick iterations and prototyping

### FLUX.2 Dev (Premium)
- **Speed**: Moderate
- **Quality**: Highly realistic and detailed
- **Best for**: Professional, photorealistic images

### SDXL Lightning (Balanced)
- **Speed**: Lightning-fast
- **Quality**: Excellent 1024px images
- **Best for**: Balanced quality and speed

## 📁 Project Structure

```
ImageGen/
├── index.html          # Main HTML file
├── styles.css          # Styling and animations
├── script.js           # Frontend JavaScript
├── server.js           # Express backend server
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **AI Models**: Cloudflare Workers AI
  - FLUX.1 Schnell by Black Forest Labs
  - FLUX.2 Dev by Black Forest Labs
  - SDXL Lightning by ByteDance

## 💡 Tips

- Use descriptive prompts for better results
- Experiment with different models for various styles
- Higher steps = better quality but slower generation
- Use negative prompts to avoid unwanted elements
- Set a seed value to reproduce the same image

## 🔧 Troubleshooting

**Images not generating?**
- Check your `.env` file has correct credentials
- Verify your Cloudflare account has Workers AI enabled
- Check the browser console for errors

**Slow generation?**
- Try reducing the number of steps
- Use FLUX.1 Schnell for faster results
- Check your internet connection

**API errors?**
- Verify your API token has Workers AI permissions
- Check if you've exceeded your usage limits
- Ensure your account ID is correct

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 🔗 Resources

- [Cloudflare Workers AI Docs](https://developers.cloudflare.com/workers-ai/)
- [FLUX Models](https://blackforestlabs.ai/)
- [SDXL Lightning](https://huggingface.co/ByteDance/SDXL-Lightning)

---

Made with ❤️ using Cloudflare Workers AI
