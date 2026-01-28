export default function FinancialResilienceChart() {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP'];
  const heights = [32, 40, 24, 52, 48, 28, 36, 16, 44];
  const currentMonthIndex = 4; // MAY

  return (
    <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h4 className="text-lg font-bold">Financial Resilience Path</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">Impact of current spending on your 2030 vision.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary"></span>
            <span className="text-xs font-medium">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></span>
            <span className="text-xs font-medium">Target</span>
          </div>
        </div>
      </div>
      <div className="h-64 flex items-end justify-between gap-4 px-2">
        {months.map((month, index) => {
          const isCurrent = index === currentMonthIndex;
          return (
            <div key={month} className="flex-1 flex flex-col items-center group relative">
              {isCurrent && (
                <div className="absolute -top-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded">Current: $2,400</div>
              )}
              <div
                className={`w-full rounded-t-lg transition-all group-hover:bg-primary/20 ${
                  isCurrent
                    ? 'bg-primary shadow-lg shadow-teal-500/20'
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}
                style={{ height: `${heights[index]}px` }}
              ></div>
              <span className="text-[10px] mt-2 font-bold text-slate-400">{month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
