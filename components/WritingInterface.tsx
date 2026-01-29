"use client";

import { useState } from "react";

type Mode = "professional" | "casual";
type ContentType = "email" | "text" | "note";

interface ProcessResponse {
  sessionId: string;
  output: string;
  processingTime: number;
  tokenUsage: {
    input: number;
    output: number;
    total: number;
  };
}

export default function WritingInterface() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("professional");
  const [contentType, setContentType] = useState<ContentType>("text");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!input.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/writing/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: input.trim(),
          mode,
          contentType,
          userId: "temp_user", // TODO: Replace with actual user ID
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process writing");
      }

      const data: ProcessResponse = await response.json();
      setOutput(data.output);
      setSessionId(data.sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTryAgain = () => {
    handleProcess();
  };

  const handleStartOver = () => {
    setInput("");
    setOutput("");
    setError(null);
    setSessionId(null);
  };

  const handleUseThisVersion = async () => {
    if (!sessionId || !output) return;

    try {
      const response = await fetch("/api/writing/finalize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          finalOutput: output,
        }),
      });

      if (response.ok) {
        // TODO: Show success message
        console.log("Session finalized - learning will be triggered");
      }
    } catch (err) {
      console.error("Failed to finalize session:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-red-600 dark:text-red-400 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                Processing Error
              </h3>
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mode Toggle */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block text-center">
            Tone
          </label>
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

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block text-center">
            Content Type
          </label>
          <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-600 p-1 bg-white dark:bg-slate-800">
            <button
              onClick={() => setContentType("email")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                contentType === "email"
                  ? "bg-blue-500 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50"
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setContentType("text")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                contentType === "text"
                  ? "bg-blue-500 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50"
              }`}
            >
              Text
            </button>
            <button
              onClick={() => setContentType("note")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                contentType === "note"
                  ? "bg-blue-500 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50"
              }`}
            >
              Note
            </button>
          </div>
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
      {!output && input && !error && (
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
          <p className="text-blue-800 dark:text-blue-200">
            Click <strong>Process Writing</strong> to enhance your text while preserving your authentic voice
          </p>
        </div>
      )}
    </div>
  );
}
