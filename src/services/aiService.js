import axios from "axios";

class AIService {
  constructor() {
    this.providers = {
      openai: {
        url: "https://api.openai.com/v1/chat/completions",
        model: "gpt-3.5-turbo",
        headers: (apiKey) => ({
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        }),
      },
      gemini: {
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
        model: "gemini-1.5-flash",
        headers: (apiKey) => ({
          "Content-Type": "application/json",
        }),
      },
    };
    this.rawErrors = []; // Store raw errors for debugging
  }

  // Store raw error responses for debugging
  storeRawError(provider, error) {
    const errorData = {
      timestamp: new Date().toISOString(),
      provider,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
          ? { ...error.config.headers, Authorization: "[REDACTED]" }
          : undefined,
      },
    };

    this.rawErrors.unshift(errorData); // Add to beginning
    if (this.rawErrors.length > 10) {
      this.rawErrors.pop(); // Keep only last 10 errors
    }

    // Also store in localStorage for persistence
    try {
      localStorage.setItem(
        "aiService_rawErrors",
        JSON.stringify(this.rawErrors)
      );
    } catch (e) {
      console.warn("Could not store errors in localStorage:", e);
    }
  }

  // Get stored raw errors
  getRawErrors() {
    try {
      const stored = localStorage.getItem("aiService_rawErrors");
      if (stored) {
        this.rawErrors = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not load errors from localStorage:", e);
    }
    return this.rawErrors;
  }

  // Clear stored errors
  clearRawErrors() {
    this.rawErrors = [];
    localStorage.removeItem("aiService_rawErrors");
  }

  async reviewCode(code, fileName, provider, apiKey, reviewRules) {
    // Check rate limits before making request
    const rateLimitKey = `rateLimit_${provider}_${apiKey.slice(-8)}`;
    const lastRequestTime = localStorage.getItem(rateLimitKey);

    if (lastRequestTime) {
      const timeSince = Date.now() - parseInt(lastRequestTime);
      const requiredWait = provider === "openai" ? 60000 : 15000; // 60s for OpenAI, 15s for Gemini

      if (timeSince < requiredWait) {
        const waitSeconds = Math.ceil((requiredWait - timeSince) / 1000);
        throw new Error(
          `Rate limit protection: Please wait ${waitSeconds} seconds before making another request. OpenAI free tier has very strict limits.`
        );
      }
    }

    try {
      // Record request time before making the call
      localStorage.setItem(rateLimitKey, Date.now().toString());

      const prompt = this.generateReviewPrompt(code, fileName, reviewRules);

      let result;
      switch (provider) {
        case "openai":
          result = await this.callOpenAI(prompt, apiKey);
          break;
        case "gemini":
          result = await this.callGemini(prompt, apiKey);
          break;
        default:
          throw new Error(`Unsupported AI provider: ${provider}`);
      }

      return result;
    } catch (error) {
      console.error("AI Review Error:", error);

      // Handle specific error types
      if (error.response?.status === 429) {
        if (provider === "openai") {
          throw new Error(
            `OpenAI rate limit exceeded! Free tier is very limited (often 3-20 requests per day total). Solutions: 1) Add $5+ credit to your OpenAI account for real usage, 2) Try Google Gemini (more generous free tier), or 3) Use our demo mode.`
          );
        } else {
          const retryAfter = error.response.headers["retry-after"];
          const waitTime = retryAfter
            ? `${retryAfter} seconds`
            : "a few minutes";
          throw new Error(
            `Rate limit exceeded. Please wait ${waitTime} before trying again.`
          );
        }
      } else if (error.response?.status === 401) {
        throw new Error(
          "Invalid API key. Please check your API key in settings and ensure it's valid."
        );
      } else if (error.response?.status === 403) {
        throw new Error(
          "Access forbidden. Your API key may not have the required permissions or you may need to add billing to your account."
        );
      } else if (error.response?.status === 500) {
        throw new Error(
          "AI service temporarily unavailable. Please try again later."
        );
      } else if (error.response?.status === 400) {
        throw new Error(
          "Bad request. The code might be too long or contain invalid characters."
        );
      } else if (
        error.code === "NETWORK_ERROR" ||
        error.message.includes("Network Error")
      ) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw new Error(`Failed to get AI review: ${error.message}`);
    }
  }

  generateReviewPrompt(code, fileName, reviewRules) {
    const enabledRules = Object.entries(reviewRules)
      .filter(([_, enabled]) => enabled)
      .map(([rule, _]) => rule.replace("check", "").toLowerCase())
      .join(", ");

    return `You are an expert code reviewer. Please analyze the following ${this.getFileLanguage(
      fileName
    )} code and provide a comprehensive review.

File: ${fileName}
Focus areas: ${enabledRules}

Code to review:
\`\`\`${this.getFileLanguage(fileName)}
${code}
\`\`\`

Please provide your review in the following JSON format:
{
  "overall_score": 85,
  "summary": "Brief summary of code quality",
  "issues": [
    {
      "type": "error|warning|suggestion",
      "category": "performance|security|style|bugs|complexity|documentation",
      "line": 5,
      "message": "Description of the issue",
      "suggestion": "How to fix it",
      "code_example": "Example of improved code"
    }
  ],
  "strengths": ["List of good practices found"],
  "recommendations": ["General recommendations for improvement"]
}

Focus on practical, actionable feedback. Be specific about line numbers when possible.`;
  }

  async callOpenAI(prompt, apiKey) {
    const config = this.providers.openai;

    try {
      // Limit code length to prevent token overflow on free tier
      const maxCodeLength = 2000; // Limit code to 2000 characters
      const truncatedPrompt =
        prompt.length > maxCodeLength + 500
          ? prompt.substring(0, maxCodeLength + 500) +
            "\n\n[Code truncated for free tier limits]"
          : prompt;

      const response = await axios.post(
        config.url,
        {
          model: config.model,
          messages: [
            {
              role: "system",
              content:
                "You are an expert code reviewer. Always respond with valid JSON only. Keep responses concise for free tier limits.",
            },
            {
              role: "user",
              content: truncatedPrompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 1500, // Reduced for free tier
        },
        {
          headers: config.headers(apiKey),
          timeout: 30000,
        }
      );

      const content = response.data.choices[0].message.content;
      return this.parseAIResponse(content);
    } catch (error) {
      // Store raw error for debugging
      this.storeRawError("openai", error);

      if (error.response?.status === 429) {
        const retryAfter = error.response.headers["retry-after"] || "60";
        throw new Error(
          `OpenAI rate limit exceeded! Free tier: 3 requests/minute. Please wait ${retryAfter} seconds. Consider upgrading for higher limits.`
        );
      }

      if (error.response?.status === 401) {
        const errorMsg = error.response.data?.error?.message || "";
        if (errorMsg.includes("insufficient_quota")) {
          throw new Error(
            `OpenAI quota exceeded! Your free credits are exhausted. Solutions:
            1. Add billing to your OpenAI account (https://platform.openai.com/account/billing)
            2. Switch to Google Gemini (free alternative) in Settings
            3. Use Demo Mode to explore features without API calls
            
            Tip: Gemini offers much more generous free limits!`
          );
        }
        throw new Error(
          `OpenAI authentication failed: Invalid API key or insufficient quota. Please check your API key and billing status.`
        );
      }

      if (error.response?.status === 403) {
        throw new Error(
          `OpenAI access forbidden. This usually means:
          1. Your free trial has ended - add billing to continue
          2. Your API key doesn't have the required permissions
          3. Switch to Google Gemini for free access without billing`
        );
      }

      if (error.response?.status === 400) {
        const errorMsg = error.response.data?.error?.message || "Bad request";
        if (errorMsg.includes("tokens")) {
          throw new Error(
            `Request too large for free tier. Try with smaller code files (under 2000 characters).`
          );
        }
        throw new Error(`OpenAI API error: ${errorMsg}`);
      }

      throw error;
    }
  }

  async callGemini(prompt, apiKey) {
    const config = this.providers.gemini;
    const url = `${config.url}?key=${apiKey}`;

    try {
      const response = await axios.post(
        url,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2000,
          },
        },
        {
          headers: config.headers(apiKey),
          timeout: 30000, // 30 second timeout
        }
      );

      console.log("Gemini response:", response.data);

      // Check if response has the expected structure
      if (!response.data.candidates || !response.data.candidates[0]) {
        throw new Error(
          "Invalid Gemini response structure: no candidates found"
        );
      }

      const candidate = response.data.candidates[0];
      if (
        !candidate.content ||
        !candidate.content.parts ||
        !candidate.content.parts[0]
      ) {
        throw new Error(
          "Invalid Gemini response structure: no content parts found"
        );
      }

      const content = candidate.content.parts[0].text;
      if (!content) {
        throw new Error("Empty response from Gemini API");
      }

      return this.parseAIResponse(content);
    } catch (error) {
      // Store raw error for debugging
      this.storeRawError("gemini", error);

      if (error.response?.status === 429) {
        throw new Error(
          "Google Gemini rate limit exceeded. Please wait a few moments before trying again."
        );
      }

      if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.error?.message || "";
        if (errorMsg.includes("API key")) {
          throw new Error(
            "Invalid Google Gemini API key. Please check your API key in Settings."
          );
        }
        if (errorMsg.includes("model")) {
          throw new Error(
            "Model access issue. The gemini-1.5-flash model might not be available in your region. Try switching to OpenAI."
          );
        }
        throw new Error(`Gemini API error: ${errorMsg}`);
      }

      if (error.response?.status === 403) {
        throw new Error(
          "Access forbidden. Please check your Google Gemini API key permissions."
        );
      }

      if (error.response?.status === 404) {
        throw new Error(
          "Gemini model not found. This could be a regional availability issue. Try switching to OpenAI."
        );
      }

      throw error;
    }
  }

  parseAIResponse(content) {
    try {
      console.log("Raw AI response content:", content);

      // Store the original content for debugging
      this.storeRawResponse(content);

      // Extract JSON from response (in case it's wrapped in markdown)
      let jsonString = content;

      // Try to extract from markdown code blocks first
      const markdownMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (markdownMatch) {
        jsonString = markdownMatch[1];
        console.log(
          "Extracted from markdown:",
          jsonString.substring(0, 200) + "..."
        );
      } else {
        // Try to extract just the JSON object using a more robust approach
        const startIndex = content.indexOf("{");
        const endIndex = content.lastIndexOf("}");
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          jsonString = content.substring(startIndex, endIndex + 1);
          console.log(
            "Extracted JSON object:",
            jsonString.substring(0, 200) + "..."
          );
        }
      }

      // Clean up any extra whitespace
      jsonString = jsonString.trim();

      // Try to fix common JSON issues
      jsonString = this.fixCommonJsonIssues(jsonString);

      const parsed = JSON.parse(jsonString);
      console.log("Successfully parsed AI response");

      // Validate required fields
      if (
        typeof parsed.overall_score !== "number" ||
        !parsed.issues ||
        !Array.isArray(parsed.issues)
      ) {
        console.error("Invalid response format - missing required fields:", {
          overall_score: typeof parsed.overall_score,
          issues: parsed.issues,
          isArray: Array.isArray(parsed.issues),
        });
        throw new Error("Invalid response format - missing required fields");
      }

      return parsed;
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      console.error("Original content length:", content.length);

      // Store the parsing error for debugging
      this.storeRawError("parsing", {
        message: error.message,
        response: {
          data: {
            originalContent: content,
            contentLength: content.length,
            errorMessage: error.message,
            errorPosition:
              error.message.match(/position (\d+)/)?.[1] || "unknown",
          },
        },
      });

      return {
        overall_score: 50,
        summary: `Failed to parse AI response: ${error.message}. Raw response stored in debug panel.`,
        issues: [
          {
            type: "error",
            category: "parsing",
            line: 1,
            message: `Could not parse AI response: ${error.message}`,
            suggestion:
              "Check the raw error debug panel below for the full response content",
            code_example: "",
          },
        ],
        strengths: [],
        recommendations: [
          "Check the Error Debug Panel for raw response details",
          "The AI response may contain malformed JSON - this is logged for debugging",
        ],
      };
    }
  }

  // Helper method to fix common JSON parsing issues
  fixCommonJsonIssues(jsonString) {
    try {
      // Replace problematic characters in code examples
      // This is a basic approach - for complex cases, we might need more sophisticated parsing

      // Fix unescaped quotes in code examples
      // This is tricky because we need to distinguish between JSON structure quotes and content quotes

      // For now, just return the original string and let JSON.parse handle it
      // If it fails, the error will be caught and stored for debugging
      return jsonString;
    } catch (e) {
      console.warn("Error in fixCommonJsonIssues:", e);
      return jsonString;
    }
  }

  // Store successful responses for debugging too
  storeRawResponse(content) {
    try {
      const responseData = {
        timestamp: new Date().toISOString(),
        type: "successful_response",
        contentLength: content.length,
        contentPreview:
          content.substring(0, 500) + (content.length > 500 ? "..." : ""),
      };

      let successfulResponses = JSON.parse(
        localStorage.getItem("aiService_successfulResponses") || "[]"
      );
      successfulResponses.unshift(responseData);
      if (successfulResponses.length > 5) {
        successfulResponses.pop();
      }
      localStorage.setItem(
        "aiService_successfulResponses",
        JSON.stringify(successfulResponses)
      );
    } catch (e) {
      console.warn("Could not store successful response:", e);
    }
  }

  getFileLanguage(fileName) {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const languageMap = {
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
      swift: "swift",
      kt: "kotlin",
      scala: "scala",
      html: "html",
      css: "css",
      scss: "scss",
      sql: "sql",
      sh: "bash",
      yml: "yaml",
      yaml: "yaml",
      json: "json",
      xml: "xml",
    };
    return languageMap[extension] || "text";
  }

  // Test API connection with minimal token usage
  async testConnection(provider, apiKey) {
    try {
      // Use a very simple test to minimize token usage
      if (provider === "openai") {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Hi" }],
            max_tokens: 1,
            temperature: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            timeout: 10000,
          }
        );

        if (response.status === 200) {
          return {
            success: true,
            message:
              "OpenAI connection successful! ⚠️ Warning: Free tier is very limited.",
          };
        }
      } else if (provider === "gemini") {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            contents: [{ parts: [{ text: "Hi" }] }],
            generationConfig: { maxOutputTokens: 1 },
          },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
          }
        );

        if (response.status === 200) {
          return {
            success: true,
            message:
              "Google Gemini connection successful! ✅ Good choice for free usage.",
          };
        }
      }

      return { success: false, message: "Unexpected response from API" };
    } catch (error) {
      console.error("Connection test error:", error);

      // Store raw error for debugging
      this.storeRawError(provider, error);

      if (error.response?.status === 429) {
        if (provider === "openai") {
          return {
            success: false,
            message:
              "Rate limit hit during test! OpenAI free tier is extremely limited. Consider switching to Google Gemini or adding billing credit.",
          };
        } else {
          return {
            success: false,
            message: "Rate limit exceeded. Please wait and try again.",
          };
        }
      } else if (error.response?.status === 401) {
        const errorMsg = error.response?.data?.error?.message || "";
        if (errorMsg.includes("insufficient_quota")) {
          return {
            success: false,
            message:
              "❌ OpenAI quota exhausted! Your free credits are used up. Switch to Google Gemini (free & generous) or add billing to OpenAI account.",
          };
        }
        return {
          success: false,
          message: "Invalid API key. Please check your key.",
        };
      } else if (error.response?.status === 403) {
        return {
          success: false,
          message:
            "Access forbidden. Free trial ended? Add billing to OpenAI or switch to Google Gemini (free alternative).",
        };
      }

      return { success: false, message: `Connection failed: ${error.message}` };
    }
  }
}

export default new AIService();
