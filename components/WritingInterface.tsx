"use client";

import { useState } from "react";

type Mode = "professional" | "casual";

export default function WritingInterface() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("professional");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!input.trim()) return;

    setIsProcessing(true);
    // TODO: Implement API call to process writing
    // For now, simulate processing
    setTimeout(() => {
      setOutput(input); // Placeholder - will be replaced with AI output
      setIsProcessing(false);
    }, 1000);
  };

  const handleTryAgain = () => {
    handleProcess();
  };

  const handleStartOver = () => {
    setInput("");
    setOutput("");
  };

  const handleUseThisVersion = () => {
    // TODO: Implement learning from edits
    console.log("User confirmed output - trigger learning");
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-600 p-1 bg-white dark:bg-slate-800">
          <button
            onClick={() => setMode("professional")}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              mode === "professional"
                ? "bg-blue-500 text-white"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50"
            }`}
          >
            Professional
          </button>
          <button
            onClick={() => setMode("casual")}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              mode === "casual"
                ? "bg-blue-500 text-white"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50"
            }`}
          >
            Casual
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Your Thoughts
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your thoughts, notes, or draft here..."
            className="flex-1 min-h-[400px] p-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {input.length} characters
            </span>
            <button
              onClick={handleProcess}
              disabled={!input.trim() || isProcessing}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? "Processing..." : "Process Writing"}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Polished Version
          </label>
          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder="Your polished version will appear here..."
            className="flex-1 min-h-[400px] p-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex items-center justify-end gap-3 mt-2">
            {output && (
              <>
                <button
                  onClick={handleStartOver}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 font-medium transition-colors"
                >
                  Start Over
                </button>
                <button
                  onClick={handleTryAgain}
                  disabled={isProcessing}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleUseThisVersion}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  ✓ Use This Version
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {!output && input && (
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
          <p className="text-blue-800 dark:text-blue-200">
            Click <strong>Process Writing</strong> to enhance your text while preserving your authentic voice
          </p>
        </div>
      )}
    </div>
  );
}
