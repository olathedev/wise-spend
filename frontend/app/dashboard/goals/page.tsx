import Header from '@/components/layout/Header';

export default function GoalsPage() {
  return (
    <>
      <Header />
      <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Goals</h2>
        <p className="text-slate-500 dark:text-slate-400">Your financial goals will appear here.</p>
      </div>
    </>
  );
}
