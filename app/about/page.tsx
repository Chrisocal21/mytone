import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            mytone
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            Your personal AI assistant that learns and replicates your unique communication style
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold text-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
          >
            Try It Now
          </Link>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 sm:p-12 mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
              Write Like You, Only Better
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Unlike generic AI writing tools, your Digital Writing Twin preserves your authentic voice 
              while enhancing clarity, grammar, and structure. It learns silently from your edits and 
              becomes more accurate with each interaction.
            </p>
            
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border-l-4 border-blue-500">
              <p className="text-slate-700 dark:text-slate-300 italic">
                "Transform messy thoughts into polished communication that sounds authentically like you."
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="text-blue-500 text-3xl mb-3">✨</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Authentic Voice Preservation
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Sounds like YOU, not generic AI. Maintains your personality, tone, and natural style.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="text-blue-500 text-3xl mb-3">🧠</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Silent Learning
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Improves automatically from your edits without requiring explicit training or feedback.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="text-blue-500 text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Single Purpose Focus
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Focused solely on writing enhancement - simpler than ChatGPT but more personal.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="text-blue-500 text-3xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Context Awareness
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Adapts to professional vs. casual communication contexts automatically.
              </p>
            </div>
          </div>

          {/* Status Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-3">🚧 Currently in Development</h3>
            <p className="text-blue-50 mb-4">
              Building the foundation for your personal writing assistant. Follow along as we develop 
              this tool from the ground up.
            </p>
            <div className="inline-block bg-white/20 rounded-full px-6 py-2 text-sm font-semibold">
              Phase 1: MVP Foundation
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 text-slate-500 dark:text-slate-400">
          <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}
