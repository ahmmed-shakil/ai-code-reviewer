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
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        model: "gemini-pro",
        headers: (apiKey) => ({
          "Content-Type": "application/json",
        }),
      },
    };
  }

  async reviewCode(code, fileName, provider, apiKey, reviewRules) {
    try {
      const prompt = this.generateReviewPrompt(code, fileName, reviewRules);

      switch (provider) {
        case "openai":
          return await this.callOpenAI(prompt, apiKey);
        case "gemini":
          return await this.callGemini(prompt, apiKey);
        default:
          throw new Error(`Unsupported AI provider: ${provider}`);
      }
    } catch (error) {
      console.error("AI Review Error:", error);

      // Handle specific error types
      if (error.response?.status === 429) {
        throw new Error(
          "Rate limit exceeded. Please wait a moment before trying again. Check your API usage limits."
        );
      } else if (error.response?.status === 401) {
        throw new Error(
          "Invalid API key. Please check your API key in settings."
        );
      } else if (error.response?.status === 403) {
        throw new Error(
          "Access forbidden. Your API key may not have the required permissions."
        );
      } else if (error.response?.status === 500) {
        throw new Error(
          "AI service temporarily unavailable. Please try again later."
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
      const response = await axios.post(
        config.url,
        {
          model: config.model,
          messages: [
            {
              role: "system",
              content:
                "You are an expert code reviewer. Always respond with valid JSON only.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        },
        {
          headers: config.headers(apiKey),
          timeout: 30000, // 30 second timeout
        }
      );

      const content = response.data.choices[0].message.content;
      return this.parseAIResponse(content);
    } catch (error) {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers["retry-after"];
        const waitTime = retryAfter ? `${retryAfter} seconds` : "a few moments";
        throw new Error(
          `OpenAI rate limit exceeded. Please wait ${waitTime} before trying again.`
        );
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

      const content = response.data.candidates[0].content.parts[0].text;
      return this.parseAIResponse(content);
    } catch (error) {
      if (error.response?.status === 429) {
        throw new Error(
          "Google Gemini rate limit exceeded. Please wait a few moments before trying again."
        );
      }
      throw error;
    }
  }

  parseAIResponse(content) {
    try {
      // Extract JSON from response (in case it's wrapped in markdown)
      const jsonMatch =
        content.match(/```json\s*([\s\S]*?)\s*```/) ||
        content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;

      const parsed = JSON.parse(jsonString);

      // Validate required fields
      if (
        !parsed.overall_score ||
        !parsed.issues ||
        !Array.isArray(parsed.issues)
      ) {
        throw new Error("Invalid response format");
      }

      return parsed;
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      return {
        overall_score: 50,
        summary:
          "Failed to parse AI response. Please check your API configuration.",
        issues: [
          {
            type: "error",
            category: "parsing",
            line: 1,
            message: "Could not parse AI response",
            suggestion: "Check your API key and try again",
            code_example: "",
          },
        ],
        strengths: [],
        recommendations: ["Verify AI provider settings"],
      };
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

  // Test API connection
  async testConnection(provider, apiKey) {
    try {
      const testCode = 'console.log("Hello, World!");';
      const testRules = { checkCodeStyle: true };

      await this.reviewCode(testCode, "test.js", provider, apiKey, testRules);
      return { success: true, message: "Connection successful!" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default new AIService();
