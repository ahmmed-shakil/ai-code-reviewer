import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Star,
  Code,
  Clock,
  Target,
} from "lucide-react";

const ReviewResults = ({ review }) => {
  const [expandedIssues, setExpandedIssues] = useState(new Set());

  if (!review) return null;

  const toggleIssue = (index) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedIssues(newExpanded);
  };

  const getIssueIcon = (type) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "suggestion":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getIssueColor = (type) => {
    switch (type) {
      case "error":
        return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20";
      case "warning":
        return "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20";
      case "suggestion":
        return "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20";
      default:
        return "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "performance":
        return "⚡";
      case "security":
        return "🔒";
      case "style":
        return "🎨";
      case "bugs":
        return "🐛";
      case "complexity":
        return "🧩";
      case "documentation":
        return "📝";
      default:
        return "📋";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const issuesByType =
    review.issues?.reduce((acc, issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1;
      return acc;
    }, {}) || {};

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Review Results
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(review.date).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-center">
            <div
              className={`text-3xl font-bold ${getScoreColor(
                review.overall_score
              )}`}
            >
              {review.overall_score}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Overall Score
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(review.overall_score / 20)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Code className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">
                {review.fileName}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">
                {review.provider}
              </span>
            </div>
          </div>
        </div>

        {/* Summary */}
        {review.summary && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-gray-700 dark:text-gray-300">{review.summary}</p>
          </div>
        )}

        {/* Issue Stats */}
        <div className="flex items-center space-x-6 mt-4 text-sm">
          {Object.entries(issuesByType).map(([type, count]) => (
            <div key={type} className="flex items-center space-x-1">
              {getIssueIcon(type)}
              <span className="text-gray-600 dark:text-gray-300">
                {count} {type}
                {count !== 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Issues */}
      {review.issues && review.issues.length > 0 && (
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Issues Found ({review.issues.length})
          </h3>
          <div className="space-y-3">
            {review.issues.map((issue, index) => (
              <div
                key={index}
                className={`rounded-lg border-2 ${getIssueColor(issue.type)}`}
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => toggleIssue(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {getCategoryIcon(issue.category)} {issue.category}
                          </span>
                          {issue.line && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                              Line {issue.line}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {issue.message}
                        </p>
                      </div>
                    </div>
                    <button className="ml-2">
                      {expandedIssues.has(index) ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedIssues.has(index) && (
                  <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
                    {issue.suggestion && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          💡 Suggestion:
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {issue.suggestion}
                        </p>
                      </div>
                    )}

                    {issue.code_example && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          ✨ Example Fix:
                        </h4>
                        <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                          <code className="text-gray-800 dark:text-gray-200">
                            {issue.code_example}
                          </code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths */}
      {review.strengths && review.strengths.length > 0 && (
        <div className="px-6 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            ✅ Strengths
          </h3>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <ul className="space-y-1">
              {review.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-green-800 dark:text-green-200">
                    {strength}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {review.recommendations && review.recommendations.length > 0 && (
        <div className="px-6 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            💡 Recommendations
          </h3>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <ul className="space-y-1">
              {review.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-800 dark:text-blue-200">
                    {recommendation}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* No Issues Found */}
      {(!review.issues || review.issues.length === 0) && (
        <div className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            Great Job! 🎉
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            No major issues found in your code. Keep up the excellent work!
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewResults;
