import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-50 group-hover:text-blue-500 transition-colors">
              mytone
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
