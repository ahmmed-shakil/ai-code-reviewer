import { create } from "zustand";

export const useStore = create((set, get) => ({
  // UI State
  darkMode: false,
  setDarkMode: (darkMode) => set({ darkMode }),

  // AI Settings
  aiProvider: "openai", // 'openai', 'gemini', 'claude'
  apiKey: "",
  setAiProvider: (provider) => set({ aiProvider: provider }),
  setApiKey: (key) => set({ apiKey: key }),

  // Review Settings
  reviewRules: {
    checkCodeStyle: true,
    checkPerformance: true,
    checkSecurity: true,
    checkBugs: true,
    checkComplexity: true,
    checkDocumentation: true,
  },
  setReviewRules: (rules) =>
    set({ reviewRules: { ...get().reviewRules, ...rules } }),

  // Code Review State
  currentReview: null,
  reviewHistory: [],
  setCurrentReview: (review) => set({ currentReview: review }),
  addToHistory: (review) =>
    set({
      reviewHistory: [review, ...get().reviewHistory.slice(0, 19)], // Keep last 20
    }),

  // File Management
  uploadedFiles: [],
  selectedFile: null,
  setUploadedFiles: (files) => set({ uploadedFiles: files }),
  setSelectedFile: (file) => set({ selectedFile: file }),
  addUploadedFile: (file) =>
    set({
      uploadedFiles: [...get().uploadedFiles, file],
    }),
  removeUploadedFile: (fileName) =>
    set({
      uploadedFiles: get().uploadedFiles.filter((f) => f.name !== fileName),
    }),

  // Git Integration
  gitRepo: null,
  gitBranch: "main",
  setGitRepo: (repo) => set({ gitRepo: repo }),
  setGitBranch: (branch) => set({ gitBranch: branch }),
}));
