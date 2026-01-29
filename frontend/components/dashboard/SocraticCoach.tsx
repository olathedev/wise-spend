export default function SocraticCoach() {
  return (
    <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white relative flex flex-col justify-between overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500"></div>
      <div className="relative z-10">
        <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-4">Socratic Coach</span>
        <h4 className="text-2xl font-bold mb-4">"Is that $6.50 latte worth 15 minutes of your future retirement?"</h4>
        <p className="text-teal-50 text-sm mb-6 opacity-90 leading-relaxed">
          I noticed a 15% spike in coffee spending this week. If redirected to your 'Home Downpayment' fund, you'd reach your goal 2 months earlier.
        </p>
      </div>
      <button className="relative z-10 bg-white text-teal-600 font-bold py-3 px-6 rounded-xl hover:bg-teal-50 transition-colors flex items-center justify-center gap-2">
        Chat with Wise Coach
        <span className="material-icons-round text-sm">arrow_forward</span>
      </button>
      <div className="absolute bottom-4 right-4 opacity-20">
        <span className="material-icons-round text-8xl">psychology</span>
      </div>
    </div>
  );
}
