import React, { useState } from "react";
import {
  Save,
  TestTube,
  Key,
  Settings as SettingsIcon,
  CheckCircle,
  AlertTriangle,
  Loader,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { useStore } from "../store/useStore";
import aiService from "../services/aiService";

const Settings = () => {
  const {
    aiProvider,
    apiKey,
    reviewRules,
    setAiProvider,
    setApiKey,
    setReviewRules,
  } = useStore();

  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const handleSaveSettings = () => {
    setApiKey(localApiKey);
    toast.success("Settings saved successfully!");
  };

  const handleTestConnection = async () => {
    if (!localApiKey) {
      toast.error("Please enter an API key first");
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus(null);

    try {
      const result = await aiService.testConnection(aiProvider, localApiKey);
      setConnectionStatus(result);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      const errorResult = { success: false, message: error.message };
      setConnectionStatus(errorResult);
      toast.error(error.message);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleRuleChange = (rule, value) => {
    setReviewRules({ [rule]: value });
  };

  const reviewRuleDescriptions = {
    checkCodeStyle:
      "Analyze code formatting, naming conventions, and style guidelines",
    checkPerformance:
      "Identify performance bottlenecks and optimization opportunities",
    checkSecurity:
      "Detect security vulnerabilities and unsafe coding practices",
    checkBugs: "Find potential bugs, logic errors, and runtime issues",
    checkComplexity: "Evaluate code complexity and suggest simplifications",
    checkDocumentation: "Review code documentation and suggest improvements",
  };

  const aiProviders = [
    {
      id: "openai",
      name: "OpenAI GPT",
      description: "Uses GPT-3.5-turbo or GPT-4 for code analysis",
      setupUrl: "https://platform.openai.com/api-keys",
    },
    {
      id: "gemini",
      name: "Google Gemini",
      description: "Uses Google's Gemini Pro model for code review",
      setupUrl: "https://makersuite.google.com/app/apikey",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Configure your AI provider and review preferences
        </p>
      </div>

      {/* AI Provider Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Key className="h-5 w-5 mr-2" />
            AI Provider Configuration
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              AI Provider
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiProviders.map((provider) => (
                <div
                  key={provider.id}
                  className={`relative cursor-pointer rounded-lg border-2 p-4 ${
                    aiProvider === provider.id
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  onClick={() => setAiProvider(provider.id)}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="aiProvider"
                      value={provider.id}
                      checked={aiProvider === provider.id}
                      onChange={() => setAiProvider(provider.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {provider.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Key Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                className="w-full px-3 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={`Enter your ${
                  aiProviders.find((p) => p.id === aiProvider)?.name
                } API key`}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get your API key from{" "}
              <a
                href={aiProviders.find((p) => p.id === aiProvider)?.setupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-500"
              >
                {aiProviders.find((p) => p.id === aiProvider)?.name} dashboard
              </a>
            </p>
          </div>

          {/* Connection Test */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleTestConnection}
              disabled={isTestingConnection || !localApiKey}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTestingConnection ? (
                <Loader className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              Test Connection
            </button>

            {connectionStatus && (
              <div
                className={`flex items-center space-x-2 ${
                  connectionStatus.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {connectionStatus.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <span className="text-sm">{connectionStatus.message}</span>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Review Rules */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2" />
            Review Rules
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Configure what aspects of code the AI should focus on during reviews
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(reviewRules).map(([rule, enabled]) => (
              <div key={rule} className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {rule
                      .replace("check", "")
                      .replace(/([A-Z])/g, " $1")
                      .trim()}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {reviewRuleDescriptions[rule]}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => handleRuleChange(rule, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
          💡 Tips for Better Reviews
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>
            • Provide context in file names (e.g., "UserController.js" vs
            "file.js")
          </li>
          <li>
            • Include comments in your code to help the AI understand your
            intent
          </li>
          <li>
            • For large files, consider reviewing specific functions or classes
            separately
          </li>
          <li>
            • Enable only the review rules relevant to your current project
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
