import React, { useState, useEffect } from "react";
import aiService from "../services/aiService";

const ErrorDebugPanel = () => {
  const [rawErrors, setRawErrors] = useState([]);
  const [successfulResponses, setSuccessfulResponses] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedError, setSelectedError] = useState(null);
  const [activeTab, setActiveTab] = useState("errors"); // 'errors' or 'responses'

  useEffect(() => {
    loadErrors();
    loadSuccessfulResponses();
  }, []);

  const loadErrors = () => {
    const errors = aiService.getRawErrors();
    setRawErrors(errors);
  };

  const loadSuccessfulResponses = () => {
    try {
      const responses = JSON.parse(
        localStorage.getItem("aiService_successfulResponses") || "[]"
      );
      setSuccessfulResponses(responses);
    } catch (e) {
      console.warn("Could not load successful responses:", e);
      setSuccessfulResponses([]);
    }
  };

  const clearErrors = () => {
    aiService.clearRawErrors();
    setRawErrors([]);
    setSelectedError(null);
  };

  const clearSuccessfulResponses = () => {
    localStorage.removeItem("aiService_successfulResponses");
    setSuccessfulResponses([]);
    setSelectedError(null);
  };

  const formatJson = (obj) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return String(obj);
    }
  };

  const getStatusColor = (status) => {
    if (status >= 500) return "text-red-600";
    if (status >= 400) return "text-orange-600";
    if (status >= 300) return "text-yellow-600";
    return "text-green-600";
  };

  if (rawErrors.length === 0 && successfulResponses.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
        <div className="text-center">
          <div className="text-gray-500 text-sm">
            🐛 No API responses recorded yet
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Both errors and successful responses will appear here for debugging
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center flex-wrap gap-2">
              🐛 API Debug Panel
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                {rawErrors.length} error{rawErrors.length !== 1 ? "s" : ""}
              </span>
              {successfulResponses.length > 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {successfulResponses.length} response
                  {successfulResponses.length !== 1 ? "s" : ""}
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Raw API responses and errors for troubleshooting
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:flex-nowrap">
            <button
              onClick={() => {
                loadErrors();
                loadSuccessfulResponses();
              }}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors whitespace-nowrap"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                clearErrors();
                clearSuccessfulResponses();
              }}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors whitespace-nowrap"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              {isExpanded ? "Collapse" : "Expand"}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab("errors")}
              className={`pb-2 px-2 sm:px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "errors"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Errors ({rawErrors.length})
            </button>
            <button
              onClick={() => setActiveTab("responses")}
              className={`pb-2 px-2 sm:px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "responses"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Responses ({successfulResponses.length})
            </button>
          </div>
          <div className="space-y-3">
            {activeTab === "errors" &&
              rawErrors.map((error, index) => (
                <div
                  key={`error-${index}`}
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedError === `error-${index}`
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() =>
                    setSelectedError(
                      selectedError === `error-${index}`
                        ? null
                        : `error-${index}`
                    )
                  }
                >
                  <div className="p-3 bg-red-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="font-medium text-gray-900">
                          {error.provider.toUpperCase()}
                        </span>
                        <span
                          className={`font-mono ${getStatusColor(
                            error.status
                          )}`}
                        >
                          {error.status} {error.statusText}
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm">
                          {new Date(error.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-gray-400 self-end sm:self-center">
                        {selectedError === `error-${index}` ? "▼" : "▶"}
                      </div>
                    </div>
                    <div className="text-xs text-black mt-1 break-words">
                      {error.message}
                    </div>
                  </div>

                  {selectedError === `error-${index}` && (
                    <div className="p-3 bg-white border-t border-gray-200">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Error Message
                          </h4>
                          <pre className="text-xs bg-gray-100 p-2 rounded text-black overflow-x-auto">
                            {error.message}
                          </pre>
                        </div>

                        {error.data && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Response Data
                            </h4>
                            <pre className="text-xs bg-gray-100 text-black p-2 rounded overflow-x-auto max-h-40 overflow-y-auto">
                              {formatJson(error.data)}
                            </pre>
                          </div>
                        )}

                        {error.config && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Request Config
                            </h4>
                            <pre className="text-xs bg-gray-100 text-black p-2 rounded overflow-x-auto max-h-32 overflow-y-auto">
                              {formatJson({
                                url: error.config.url,
                                method: error.config.method,
                                headers: error.config.headers,
                              })}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

            {activeTab === "responses" &&
              successfulResponses.map((response, index) => (
                <div
                  key={`response-${index}`}
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedError === `response-${index}`
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() =>
                    setSelectedError(
                      selectedError === `response-${index}`
                        ? null
                        : `response-${index}`
                    )
                  }
                >
                  <div className="p-3 bg-green-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="font-medium text-gray-900">
                          SUCCESSFUL RESPONSE
                        </span>
                        <span className="text-green-600 font-mono">
                          {response.contentLength} chars
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm">
                          {new Date(response.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-gray-400 self-end sm:self-center">
                        {selectedError === `response-${index}` ? "▼" : "▶"}
                      </div>
                    </div>
                    <div className="text-xs text-black mt-1 break-words">
                      {response.contentPreview}
                    </div>
                  </div>

                  {selectedError === `response-${index}` && (
                    <div className="p-3 bg-white border-t border-gray-200">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Response Preview (First 500 characters)
                          </h4>
                          <pre className="text-xs bg-gray-100 p-2 rounded text-black overflow-x-auto max-h-60 overflow-y-auto">
                            {response.contentPreview}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Debug Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li className="break-words">
                • <strong>401 Unauthorized:</strong> Check API key validity
              </li>
              <li className="break-words">
                • <strong>403 Forbidden:</strong> API key lacks permissions or
                billing required
              </li>
              <li className="break-words">
                • <strong>429 Rate Limited:</strong> Too many requests, wait and
                retry
              </li>
              <li className="break-words">
                • <strong>404 Not Found:</strong> Model not available in your
                region
              </li>
              <li className="break-words">
                • <strong>500 Server Error:</strong> Temporary service issue
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorDebugPanel;
