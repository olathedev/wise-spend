interface Transaction {
  id: string;
  name: string;
  date: string;
  method: string;
  category: "ESSENTIAL" | "LUXURY";
  amount: string;
  icon: string;
  iconBg: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    name: "Starbucks Coffee",
    date: "Today, 09:15 AM",
    method: "Parsed via Photo",
    category: "LUXURY",
    amount: "-$6.50",
    icon: "local_cafe",
    iconBg: "bg-black",
  },
  {
    id: "2",
    name: "Whole Foods Market",
    date: "Yesterday, 06:40 PM",
    method: "Auto-Sync",
    category: "ESSENTIAL",
    amount: "-$142.20",
    icon: "shopping_cart",
    iconBg: "bg-blue-600",
  },
  {
    id: "3",
    name: "Netflix Subscription",
    date: "Mar 12, 11:00 AM",
    method: "Auto-Sync",
    category: "LUXURY",
    amount: "-$15.99",
    icon: "movie",
    iconBg: "bg-red-500",
  },
];

export default function TransactionList() {
  return (
    <div className="lg:col-span-2 bg-card-light dark:bg-card-dark rounded-2xl border border-slate-100 dark:border-slate-300 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h4 className="text-base sm:text-lg font-bold text-black dark:text-black">
          Vision-to-Data Parsing
        </h4>
        <div className="flex gap-2">
          <button className="text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
            All
          </button>
          <button className="text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full text-slate-400 hover:text-slate-600">
            Essential
          </button>
          <button className="text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full text-slate-400 hover:text-slate-600">
            Luxury
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-slate-50 dark:border-slate-200 bg-slate-200 dark:bg-slate-50/30 gap-4"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div
                className={`w-12 h-12 ${transaction.iconBg} rounded-lg flex items-center justify-center text-white overflow-hidden shrink-0`}
              >
                <span className="material-icons-round">{transaction.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-black dark:text-black truncate">
                  {transaction.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {transaction.date} • {transaction.method}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto text-right">
              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    transaction.category === "LUXURY"
                      ? "text-orange-500 bg-orange-50 dark:bg-orange-900/20"
                      : "text-teal-500 bg-teal-50 dark:bg-teal-900/20"
                  }`}
                >
                  {transaction.category}
                </span>
                <p className="font-bold text-lg text-black dark:text-black ml-auto sm:ml-0">
                  {transaction.amount}
                </p>
              </div>
              <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                <span className="material-icons-round">chevron_right</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
