import React, { useState, useCallback } from "react";
import {
  Upload,
  Play,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader,
  X,
  Zap,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import { useStore } from "../store/useStore";
import aiService from "../services/aiService";
import ReviewResults from "../components/ReviewResults";
import FileUpload from "../components/FileUpload";
import RateLimitInfo from "../components/RateLimitInfo";
import { sampleCode, sampleReview, demoFiles } from "../utils/demoData";

const CodeReview = () => {
  const {
    darkMode,
    aiProvider,
    apiKey,
    reviewRules,
    currentReview,
    setCurrentReview,
    addToHistory,
    uploadedFiles,
    selectedFile,
    setSelectedFile,
  } = useStore();

  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("untitled.js");
  const [isReviewing, setIsReviewing] = useState(false);
  const [activeTab, setActiveTab] = useState("editor"); // 'editor' or 'upload'

  const handleEditorChange = useCallback((value) => {
    setCode(value || "");
  }, []);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setCode(file.content);
    setFileName(file.name);
    setActiveTab("editor");
  };

  const handleRunReview = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to review");
      return;
    }

    if (!apiKey) {
      toast.error("Please configure your AI API key in settings");
      return;
    }

    // Check for recent requests to prevent rate limiting
    const lastRequestKey = `lastRequest_${aiProvider}`;
    const lastRequest = localStorage.getItem(lastRequestKey);
    if (lastRequest) {
      const timeSince = Date.now() - new Date(lastRequest).getTime();
      const cooldownTime = aiProvider === "openai" ? 20000 : 10000; // 20s for OpenAI, 10s for Gemini

      if (timeSince < cooldownTime) {
        const waitTime = Math.ceil((cooldownTime - timeSince) / 1000);
        toast.error(
          `Please wait ${waitTime} seconds before making another request to avoid rate limits`
        );
        return;
      }
    }

    setIsReviewing(true);

    try {
      // Record request time
      localStorage.setItem(lastRequestKey, new Date().toISOString());

      const review = await aiService.reviewCode(
        code,
        fileName,
        aiProvider,
        apiKey,
        reviewRules
      );

      const reviewWithMetadata = {
        ...review,
        fileName,
        date: new Date().toISOString(),
        code,
        provider: aiProvider,
      };

      setCurrentReview(reviewWithMetadata);
      addToHistory(reviewWithMetadata);

      toast.success("Code review completed!");
    } catch (error) {
      console.error("Review error:", error);

      // Show user-friendly error messages
      if (
        error.message.includes("rate limit") ||
        error.message.includes("429")
      ) {
        toast.error(error.message, { duration: 6000 });
      } else if (error.message.includes("API key")) {
        toast.error("Invalid API key. Please check your settings.");
      } else {
        toast.error(`Review failed: ${error.message}`);
      }
    } finally {
      setIsReviewing(false);
    }
  };

  const handleDemoReview = () => {
    const demoReviewResult = {
      ...sampleReview,
      fileName,
      date: new Date().toISOString(),
      code,
      provider: "demo",
    };

    setCurrentReview(demoReviewResult);
    addToHistory(demoReviewResult);
    toast.success("Demo review completed! This is a sample result.");
  };

  const loadDemoCode = (language) => {
    if (sampleCode[language]) {
      setCode(sampleCode[language]);
      setFileName(
        `demo.${
          language === "javascript"
            ? "js"
            : language === "typescript"
            ? "ts"
            : "py"
        }`
      );
      setActiveTab("editor");
      toast.success(`Loaded ${language} demo code`);
    }
  };

  const handleClearReview = () => {
    setCurrentReview(null);
  };

  const handleExportReview = () => {
    if (!currentReview) return;

    const exportData = {
      ...currentReview,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `review-${fileName}-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Review exported successfully!");
  };

  const getLanguageFromFileName = (name) => {
    const ext = name.split(".").pop()?.toLowerCase();
    const langMap = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      cs: "csharp",
      php: "php",
      rb: "ruby",
      go: "go",
      rs: "rust",
      html: "html",
      css: "css",
      json: "json",
    };
    return langMap[ext] || "javascript";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Code Review
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Upload files or paste code for AI-powered analysis
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {currentReview && (
            <>
              <button
                onClick={handleExportReview}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
              <button
                onClick={handleClearReview}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </button>
            </>
          )}

          {!apiKey && (
            <button
              onClick={handleDemoReview}
              disabled={isReviewing || !code.trim()}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="h-4 w-4 mr-2" />
              Try Demo
            </button>
          )}

          <button
            onClick={handleRunReview}
            disabled={isReviewing || !code.trim() || !apiKey}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isReviewing ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isReviewing ? "Reviewing..." : "Run Review"}
          </button>
        </div>
      </div>

      {/* API Key Warning */}
      {!apiKey && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                API Key Required for AI Review
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Configure your AI provider API key in settings to get real
                AI-powered reviews, or try the demo mode below.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => loadDemoCode("javascript")}
                  className="inline-flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs font-medium hover:bg-yellow-200 dark:hover:bg-yellow-800"
                >
                  Load JavaScript Demo
                </button>
                <button
                  onClick={() => loadDemoCode("python")}
                  className="inline-flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs font-medium hover:bg-yellow-200 dark:hover:bg-yellow-800"
                >
                  Load Python Demo
                </button>
                <button
                  onClick={() => loadDemoCode("typescript")}
                  className="inline-flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs font-medium hover:bg-yellow-200 dark:hover:bg-yellow-800"
                >
                  Load TypeScript Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rate Limit Information */}
      {apiKey && <RateLimitInfo provider={aiProvider} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Code Input */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("editor")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === "editor"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <FileText className="h-4 w-4 inline mr-1" />
              Code Editor
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === "upload"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Upload className="h-4 w-4 inline mr-1" />
              Upload Files
            </button>
          </div>

          {activeTab === "editor" ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              {/* File Name Input */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter file name (e.g., app.js)"
                />
              </div>

              {/* Monaco Editor */}
              <div className="h-96">
                <Editor
                  height="100%"
                  language={getLanguageFromFileName(fileName)}
                  theme={darkMode ? "vs-dark" : "light"}
                  value={code}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    renderWhitespace: "selection",
                    tabSize: 2,
                    insertSpaces: true,
                  }}
                />
              </div>
            </div>
          ) : (
            <FileUpload onFileSelect={handleFileSelect} />
          )}

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Uploaded Files
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedFile?.name === file.name
                        ? "bg-primary-50 dark:bg-primary-900/20"
                        : ""
                    }`}
                    onClick={() => handleFileSelect(file)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {file.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Review Results */}
        <div>
          {currentReview ? (
            <ReviewResults review={currentReview} />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Ready for Review
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enter your code and click "Run Review" to get AI-powered
                feedback and suggestions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeReview;
