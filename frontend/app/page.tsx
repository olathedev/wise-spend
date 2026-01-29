import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center space-y-8 px-4">
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="material-icons-round text-5xl text-primary">account_balance_wallet</span>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white">WiseSpend</h1>
        </div>
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
          Transform Financial Fog into Actionable Resilience
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Your AI-powered financial coach that understands your spending and guides you toward your goals.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/auth/signin"
            className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
