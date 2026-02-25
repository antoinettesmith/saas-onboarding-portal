import { useState, useEffect } from "react";
import OnboardingProgressTracker from "./OnboardingProgressTracker";

const STORAGE_KEY = "onboarding_portal_first_name";

export default function App() {
  const [userName, setUserName] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored.trim()) {
      setUserName(stored.trim());
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = inputValue.trim();
    if (name) {
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      setUserName(capitalized);
      localStorage.setItem(STORAGE_KEY, capitalized);
    }
  };

  if (userName === null) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center p-6"
        style={{
          backgroundColor: "#1a1a1a",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div className="max-w-md w-full text-center">
          <p className="text-sm text-purple-400 mb-3 font-medium">
            ✨ A portfolio project by Antoinette Smith
          </p>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to SmithTech Onboarding
          </h1>
          <p className="text-gray-400 text-sm mb-2">
            (SmithTech is totally made up—this is a demo! 🤫)
          </p>
          <p className="text-gray-400 mb-8">
            Let's get started! Enter your first name below to play along.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your first name"
              className="w-full px-4 py-3 rounded-lg bg-[#2d2d2d] border border-[#3a3a3a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6b65ff] focus:border-transparent"
              autoFocus
              required
              minLength={1}
            />
            <button
              type="submit"
              className="w-full px-6 py-3 text-sm font-bold text-white rounded-full transition-colors hover:opacity-90"
              style={{ backgroundColor: "#6b65ff" }}
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <OnboardingProgressTracker userName={userName} />
    </div>
  );
}
