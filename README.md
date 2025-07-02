# AI Code Reviewer

An intelligent code review platform that uses AI to analyze code quality, detect bugs, suggest improvements, and provide automated feedback. Built with React, Vite, and integrates with popular AI providers.

![AI Code Reviewer](https://img.shields.io/badge/AI-Code%20Reviewer-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.0-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.5-blue)

## ✨ Features

- **🤖 AI-Powered Analysis**: Integrates with OpenAI GPT and Google Gemini for intelligent code review
- **📝 Multi-Language Support**: Supports JavaScript, TypeScript, Python, Java, C++, and many more
- **🎯 Customizable Rules**: Configure review focus areas (performance, security, style, bugs, etc.)
- **📱 Modern UI**: Beautiful, responsive interface with dark mode support
- **💾 Review History**: Track and export your code review history
- **📁 File Management**: Upload multiple files or paste code directly
- **🔧 Monaco Editor**: Full-featured code editor with syntax highlighting
- **📊 Detailed Reports**: Comprehensive feedback with scores, suggestions, and examples
- **🐛 Error Debugging**: Built-in panel to view raw API errors for troubleshooting
- **📖 Provider Guide**: Comprehensive guide comparing AI providers and setup instructions
- **🎮 Demo Mode**: Explore features without API keys using sample data

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- API key from one of the supported AI providers:
  - [OpenAI API Key](https://platform.openai.com/api-keys)
  - [Google Gemini API Key](https://makersuite.google.com/app/apikey)

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000`

### Configuration

1. **Go to Settings** (`/settings` route)
2. **Select your AI provider** (OpenAI or Google Gemini)
3. **Enter your API key**
4. **Test the connection**
5. **Configure review rules** based on your preferences

## 📋 Supported File Types

- **JavaScript**: `.js`, `.jsx`
- **TypeScript**: `.ts`, `.tsx`
- **Python**: `.py`
- **Java**: `.java`
- **C/C++**: `.c`, `.cpp`
- **C#**: `.cs`
- **PHP**: `.php`
- **Ruby**: `.rb`
- **Go**: `.go`
- **Rust**: `.rs`
- **Swift**: `.swift`
- **Kotlin**: `.kt`
- **Scala**: `.scala`
- **Web**: `.html`, `.css`, `.scss`
- **Data**: `.json`, `.yaml`, `.yml`, `.xml`
- **Scripts**: `.sh`, `.sql`

## 🎯 Review Categories

- **🐛 Bug Detection**: Identifies potential runtime errors and logic issues
- **🔒 Security Analysis**: Detects security vulnerabilities and unsafe practices
- **⚡ Performance**: Finds performance bottlenecks and optimization opportunities
- **🎨 Code Style**: Checks formatting, naming conventions, and best practices
- **🧩 Complexity**: Evaluates code complexity and suggests simplifications
- **📝 Documentation**: Reviews code documentation and suggests improvements

## 🔧 Technology Stack

- **Frontend**: React 18, Vite 5
- **Styling**: TailwindCSS 3.3
- **Code Editor**: Monaco Editor
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM

## 📂 Project Structure

```
ai-code-reviewer/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── FileUpload.jsx
│   │   └── ReviewResults.jsx
│   ├── pages/              # Main application pages
│   │   ├── Dashboard.jsx
│   │   ├── CodeReview.jsx
│   │   └── Settings.jsx
│   ├── services/           # External service integrations
│   │   └── aiService.js
│   ├── store/              # State management
│   │   └── useStore.js
│   ├── App.jsx             # Main app component
│   ├── main.jsx           # App entry point
│   └── index.css          # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Configuration Options

### AI Providers

#### OpenAI Configuration

- **Model**: GPT-3.5-turbo (default) or GPT-4
- **API Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Required**: OpenAI API key

#### Google Gemini Configuration

- **Model**: Gemini 1.5 Flash (latest, optimized for speed and efficiency)
- **API Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- **Required**: Google AI API key
- **Benefits**: Much more generous free tier, excellent for portfolio projects

### Review Rules

Configure which aspects to focus on during code review:

- Code Style Analysis
- Performance Optimization
- Security Vulnerability Detection
- Bug Detection
- Complexity Analysis
- Documentation Review

## 📊 Review Output Format

Each review provides:

- **Overall Score**: 0-100% quality rating
- **Summary**: Brief overview of code quality
- **Issues**: Categorized problems with line numbers
- **Suggestions**: Actionable improvement recommendations
- **Code Examples**: Sample fixes for identified issues
- **Strengths**: Positive aspects of the code

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Static Hosting

The built files in the `dist` folder can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions workflow
- **AWS S3**: Upload to S3 bucket with static website hosting

## 🔐 Security Considerations

- **API Keys**: Stored locally in browser storage (not on servers)
- **Code Privacy**: Code is sent only to your chosen AI provider
- **No Backend**: Pure client-side application for maximum privacy
- **HTTPS**: Always use HTTPS in production for API communications

## ⚠️ Rate Limits & Troubleshooting

### AI Provider Comparison for Portfolio Projects

**🌟 Google Gemini (Recommended for Portfolio Use)**

- ✅ Very generous free tier (15 requests/minute, 1,500/day)
- ✅ Uses latest Gemini 1.5 Flash model
- ✅ No billing required for basic usage
- ✅ Perfect for portfolio demonstrations
- ⚠️ May not be available in all regions

**⚠️ OpenAI (Extremely Limited Free Tier)**

- ❌ Free tier: Often just 3-20 requests PER DAY total
- ❌ Requires billing for practical use ($5+ minimum)
- ❌ Free credits expire quickly
- ✅ High quality responses when it works
- ✅ Well-established service

### New Debugging Features

**🐛 Error Debug Panel**

- View raw API error responses from both OpenAI and Gemini
- Timestamp and categorize errors for easy troubleshooting
- Persistent error storage across sessions
- Clear actionable tips for each error type

**📖 AI Provider Setup Guide**

- Comprehensive comparison of available providers
- Step-by-step setup instructions for each service
- Alternative providers for different use cases
- Portfolio project recommendations

### API Rate Limits

#### OpenAI (⚠️ VERY Limited Free Tier)

- **Free Tier**: Often just 3-20 requests PER DAY (not per minute!)
- **Reality**: Free tier exhausts after just a few tests
- **Paid Tier**: $5+ credit gives 3,500+ requests/minute
- **Recommendation**: Add billing credit or use Gemini for free usage

#### Google Gemini (Recommended for Free Users)

- **Free Tier**: 15 requests/minute, 1,500 requests/day
- **Model**: Gemini 1.5 Flash (optimized for speed and efficiency)
- **Much more generous**: Actually usable for development and portfolio demos
- **Paid Tier**: 1,000+ requests/minute
- **Recommendation**: Best choice for free usage and portfolio projects

### Common Issues & Solutions

**Error 404 - Model Not Found (Gemini)**

- The gemini-pro model has been deprecated
- App now uses gemini-1.5-flash (latest supported model)
- If still getting 404: Model may not be available in your region
- Solution: Try switching to OpenAI or use demo mode

**Error 429 - Rate Limit Exceeded**

- Wait for the cooldown period before making another request
- Consider upgrading to a paid API plan for higher limits
- Use the built-in rate limiting features in the app
- **For OpenAI free tier**: Switch to Google Gemini for more generous limits

**Error 401 - Invalid API Key**

- Double-check your API key in Settings
- Ensure the API key has the correct permissions
- Regenerate the API key if needed

**Error 403 - Access Forbidden**

- Your API key may not have the required permissions
- Check your API provider's billing and usage settings

**Error 400 - Bad Request (OpenAI)**

- Code might be too long for free tier (keep under 2000 characters)
- Try breaking large files into smaller chunks
- Remove unnecessary comments or whitespace

**Network Errors**

- Check your internet connection
- Verify the API provider's status page
- Try again after a few moments

### 💡 Tips for Portfolio Projects

1. **Use Google Gemini**: Much better free tier for demonstrations
2. **Enable error debugging**: Use the new debug panel to showcase error handling
3. **Try demo mode**: Perfect for showing features without API limits
4. **Keep code focused**: Shorter code samples work better for free tiers
5. **Use provider guide**: Show your understanding of different AI services
6. **Document your choices**: Explain why you chose certain providers or features

### 💡 Tips for OpenAI Free Tier Users

1. **Keep code short**: Under 2000 characters works best
2. **Wait between requests**: 60+ seconds minimum
3. **Consider Gemini**: 5x more requests per minute for free
4. **Use demo mode**: Test the interface without API calls
5. **Focus reviews**: Disable unnecessary review rules to get shorter responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for developers who care about code quality!
