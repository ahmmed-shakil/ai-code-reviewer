import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle, Info } from "lucide-react";

const RateLimitInfo = ({ provider }) => {
  const [lastRequestTime, setLastRequestTime] = useState(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(`lastRequest_${provider}`);
    if (stored) {
      setLastRequestTime(new Date(stored));
    }
  }, [provider]);

  useEffect(() => {
    if (!lastRequestTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeSince = now - lastRequestTime;
      const cooldownTime = provider === "openai" ? 20000 : 10000; // 20s for OpenAI, 10s for Gemini
      const remaining = Math.max(0, cooldownTime - timeSince);

      setCooldownRemaining(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastRequestTime, provider]);

  const updateLastRequest = () => {
    const now = new Date();
    setLastRequestTime(now);
    localStorage.setItem(`lastRequest_${provider}`, now.toISOString());
  };

  const rateLimits = {
    openai: {
      free: "⚠️ Free tier: Very limited (often 3-20 requests/day total)",
      paid: "Paid tier ($5+ credit): 3,500+ requests/minute",
      recommendation:
        "� Free tier exhausts quickly! Add $5+ credit for real usage",
    },
    gemini: {
      free: "Free tier: 15 requests/minute, 1,500 requests/day",
      paid: "Paid tier: 1,000+ requests/minute",
      recommendation: "Much more generous free tier than OpenAI",
    },
  };

  const currentLimits = rateLimits[provider] || rateLimits.openai;

  return (
    <div className="space-y-3">
      {cooldownRemaining > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Cooldown Active
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Wait {Math.ceil(cooldownRemaining / 1000)} seconds to avoid rate
                limits
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {provider === "openai" ? "OpenAI" : "Google Gemini"} Rate Limits
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 mt-1 space-y-1">
              <li>• {currentLimits.free}</li>
              <li>• {currentLimits.paid}</li>
              <li>• {currentLimits.recommendation}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateLimitInfo;
