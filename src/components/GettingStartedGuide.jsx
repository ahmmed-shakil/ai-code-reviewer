import React from "react";
import { Link } from "react-router-dom";
import {
  Code,
  Settings,
  Key,
  Zap,
  ExternalLink,
  CheckCircle,
} from "lucide-react";

const GettingStartedGuide = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        🚀 Getting Started
      </h2>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              1
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Get an AI API Key (Optional)
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Get a free API key from{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-500 inline-flex items-center"
              >
                OpenAI <ExternalLink className="h-3 w-3 ml-1" />
              </a>{" "}
              or{" "}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-500 inline-flex items-center"
              >
                Google Gemini <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              2
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Configure Settings
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Go to{" "}
              <Link
                to="/settings"
                className="text-primary-600 hover:text-primary-500 inline-flex items-center"
              >
                <Settings className="h-3 w-3 mr-1" />
                Settings
              </Link>{" "}
              to add your API key and customize review rules.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              3
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Start Reviewing Code
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Head to{" "}
              <Link
                to="/review"
                className="text-primary-600 hover:text-primary-500 inline-flex items-center"
              >
                <Code className="h-3 w-3 mr-1" />
                Code Review
              </Link>{" "}
              to upload files or paste code directly. You can also try the demo
              mode without an API key!
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Try Demo Mode First!
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                No API key? No problem! Use our demo mode to see how AI code
                reviews work with sample code and results.
              </p>
              <Link
                to="/review"
                className="inline-flex items-center mt-2 text-sm font-medium text-blue-700 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-200"
              >
                Try Demo Now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedGuide;
