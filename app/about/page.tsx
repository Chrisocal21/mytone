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
              mytone is an AI writing assistant that learns your unique communication style. It analyzes 
              your edits, tracks vocabulary preferences, tone adjustments, and structural patterns to 
              enhance your writing while preserving your authentic voice. With temporal weighting and 
              confidence scoring, it continuously adapts to your evolving style.
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
              <div className="text-blue-500 text-3xl mb-3">🧠</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Advanced Learning System
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Extracts patterns from your edits with confidence scoring, temporal weighting, and automatic improvement over time.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="text-blue-500 text-3xl mb-3">💬</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Chat-Style Refinement
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Refine outputs with natural language requests. Quick actions for tone, length, and formality adjustments.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="text-blue-500 text-3xl mb-3">📊</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Progress Analytics
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Track learning progress, pattern confidence, and style evolution. Export data or reset patterns anytime.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="text-blue-500 text-3xl mb-3">🔒</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Privacy First
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Password-protected access, secure data storage with Cloudflare D1, and full control over your learning data.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="text-blue-500 text-3xl mb-3">📝</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Session History
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Access past writing sessions grouped by date. Load previous work to continue refining or reference.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="text-blue-500 text-3xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Response Caching
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Smart caching returns identical requests instantly, reducing API costs and improving performance.
              </p>
            </div>
          </div>

          {/* Status Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-3">✅ Phase 2 Complete</h3>
              <p className="text-blue-50 mb-4">
                Advanced learning system, analytics, session management, and profile customization now live.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="font-bold mb-2">✅ Phase 1</div>
                <div className="text-blue-50">MVP Foundation Complete</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="font-bold mb-2">✅ Phase 2</div>
                <div className="text-blue-50">Learning Enhancement Complete</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4 border-2 border-white/40">
                <div className="font-bold mb-2">🔄 Phase 3</div>
                <div className="text-blue-50">Testing & Refinement</div>
              </div>
            </div>
          </div>
          
          {/* Tech Stack */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">Built With Modern Tech</h3>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full font-semibold">Next.js 16</span>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full font-semibold">TypeScript</span>
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full font-semibold">OpenAI GPT-4o-mini</span>
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-full font-semibold">Cloudflare D1</span>
              <span className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-4 py-2 rounded-full font-semibold">Tailwind CSS</span>
              <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full font-semibold">Vercel</span>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 text-slate-500 dark:text-slate-400">
          <p className="mb-2">mytone - Your Personal Writing Assistant</p>
          <p className="text-sm">January 2026 • Phase 2 Complete</p>
        </footer>
      </div>
    </div>
  );
}
