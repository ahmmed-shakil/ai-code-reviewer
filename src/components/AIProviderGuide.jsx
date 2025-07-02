import React, { useState } from "react";
import {
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
} from "lucide-react";

const AIProviderGuide = () => {
  const [activeProvider, setActiveProvider] = useState("gemini");

  const providers = [
    {
      id: "gemini",
      name: "Google Gemini",
      status: "recommended",
      cost: "Free",
      limits: "Very generous free tier",
      pros: [
        "Excellent free tier with high limits",
        "No billing required for basic usage",
        "Good code analysis capabilities",
        "Latest AI technology",
      ],
      cons: [
        "May not be available in all regions",
        "Newer service, less established",
      ],
      setupSteps: [
        "Go to Google AI Studio",
        "Sign in with your Google account",
        "Create a new API key",
        "Copy the key to settings",
      ],
      setupUrl: "https://makersuite.google.com/app/apikey",
      modelInfo: "Uses Gemini 1.5 Flash - optimized for speed and efficiency",
    },
    {
      id: "openai",
      name: "OpenAI GPT",
      status: "limited",
      cost: "Free tier very limited",
      limits: "3 requests/minute, $5 credit expires",
      pros: [
        "High quality responses",
        "Well-established service",
        "Excellent documentation",
        "Wide model selection",
      ],
      cons: [
        "Extremely limited free tier",
        "Requires billing for practical use",
        "More expensive than alternatives",
        "Strict rate limits",
      ],
      setupSteps: [
        "Create OpenAI account",
        "Add billing information (required for practical use)",
        "Generate API key",
        "Copy key to settings",
      ],
      setupUrl: "https://platform.openai.com/api-keys",
      modelInfo:
        "Uses GPT-3.5-turbo - reliable but requires billing for regular use",
    },
  ];

  const alternatives = [
    {
      name: "Anthropic Claude",
      status: "Limited Free Tier",
      description: "High-quality AI with focus on safety and helpfulness",
      url: "https://console.anthropic.com/",
      note: "Has a free tier but requires phone verification",
    },
    {
      name: "Hugging Face Inference API",
      status: "Free with Limits",
      description: "Access to various open-source models",
      url: "https://huggingface.co/inference-api",
      note: "Good for experimentation, rate limited",
    },
    {
      name: "Ollama (Local)",
      status: "Completely Free",
      description: "Run AI models locally on your machine",
      url: "https://ollama.ai/",
      note: "No API limits but requires powerful hardware",
    },
    {
      name: "Groq",
      status: "Free Tier Available",
      description: "Fast inference with various open-source models",
      url: "https://groq.com/",
      note: "Very fast responses, good free tier",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "recommended":
        return "bg-green-100 text-green-800 border-green-200";
      case "limited":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "warning":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "recommended":
        return <CheckCircle className="w-4 h-4" />;
      case "limited":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            🤖 AI Provider Comparison
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Choose the best AI provider for your needs and budget
          </p>
        </div>

        <div className="p-4">
          {/* Provider Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  activeProvider === provider.id
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setActiveProvider(provider.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 flex items-center">
                      {provider.name}
                      {provider.id === "gemini" && (
                        <Star className="w-4 h-4 ml-1 text-yellow-500 fill-current" />
                      )}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {provider.modelInfo}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                      provider.status
                    )}`}
                  >
                    {getStatusIcon(provider.status)}
                    <span className="ml-1">
                      {provider.status === "recommended"
                        ? "Recommended"
                        : "Limited"}
                    </span>
                  </span>
                </div>

                {/* <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost:</span>
                    <span className="font-medium">{provider.cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Limits:</span>
                    <span className="font-medium">{provider.limits}</span>
                  </div>
                </div> */}
              </div>
            ))}
          </div>

          {/* Detailed Provider Info */}
          {activeProvider && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {(() => {
                const provider = providers.find((p) => p.id === activeProvider);
                return (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Setup Guide: {provider.name}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">
                          ✅ Pros
                        </h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {provider.pros.map((pro, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-orange-700 mb-2">
                          ⚠️ Cons
                        </h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {provider.cons.map((con, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-orange-500 mr-2">•</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">
                        🚀 Setup Steps
                      </h5>
                      <ol className="text-sm text-gray-700 space-y-1">
                        {provider.setupSteps.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="bg-blue-100 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                      <a
                        href={provider.setupUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Get API Key
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Alternative Providers */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            🔄 Alternative AI Providers
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Other AI services you might consider
          </p>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alternatives.map((alt, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{alt.name}</h4>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {alt.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{alt.description}</p>
                <p className="text-xs text-gray-500 mb-3">{alt.note}</p>
                <a
                  href={alt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  Learn More
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIProviderGuide;
