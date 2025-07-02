import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import CodeReview from "./pages/CodeReview";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useStore } from "./store/useStore";

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

function App() {
  const { darkMode } = useStore();

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/review" element={<CodeReview />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: darkMode ? "#374151" : "#ffffff",
              color: darkMode ? "#ffffff" : "#000000",
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;
