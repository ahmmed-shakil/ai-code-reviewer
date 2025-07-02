import React from "react";
import { Link } from "react-router-dom";
import {
  Code,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  GitBranch,
} from "lucide-react";
import { useStore } from "../store/useStore";
import GettingStartedGuide from "../components/GettingStartedGuide";

const Dashboard = () => {
  const { reviewHistory, uploadedFiles, currentReview } = useStore();

  const stats = {
    totalReviews: reviewHistory.length,
    avgScore:
      reviewHistory.length > 0
        ? Math.round(
            reviewHistory.reduce(
              (sum, review) => sum + review.overall_score,
              0
            ) / reviewHistory.length
          )
        : 0,
    filesUploaded: uploadedFiles.length,
    lastReviewDate: reviewHistory.length > 0 ? reviewHistory[0].date : null,
  };

  const recentReviews = reviewHistory.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to AI Code Reviewer
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Get intelligent feedback on your code quality, detect bugs, and
          receive actionable suggestions to improve your development workflow.
        </p>
      </div>

      {/* API Provider Tip */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Getting Rate Limited?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>OpenAI free tier</strong> has very strict limits (often
              just 3-20 requests per day). <strong> Google Gemini</strong>{" "}
              offers much more generous free usage.
              <Link
                to="/settings"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Switch providers in Settings →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/review"
          className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg">
              <Code className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                Start Code Review
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Upload files or paste code for AI analysis
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/settings"
          className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
                Configure Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Set up AI provider and review preferences
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Reviews
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalReviews}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Avg Score
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.avgScore}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
              <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Files Uploaded
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.filesUploaded}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Last Review
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {stats.lastReviewDate
                  ? new Date(stats.lastReviewDate).toLocaleDateString()
                  : "Never"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      {recentReviews.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Reviews
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentReviews.map((review, index) => (
              <div key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {review.overall_score >= 80 ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : review.overall_score >= 60 ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {review.fileName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Score: {review.overall_score}%
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {review.issues?.length || 0} issues found
                      </p>
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(review.overall_score / 20)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {review.summary && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {review.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started */}
      {reviewHistory.length === 0 && <GettingStartedGuide />}
    </div>
  );
};

export default Dashboard;
