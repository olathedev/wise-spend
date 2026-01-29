export default function Header() {
  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <h2 className="text-3xl font-bold text-black dark:text-black">Welcome back, Daniel</h2>
        <p className="text-slate-500 dark:text-slate-400">Your financial vision is crystal clear today.</p>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
          <span className="material-icons-round text-2xl">notifications</span>
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] text-white flex items-center justify-center rounded-full font-bold">3</span>
        </button>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-1.5 pr-4 rounded-full border border-slate-200 dark:border-slate-700">
          <img
            alt="User avatar"
            className="w-10 h-10 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5l09NzMqhL2raDQElTcQLGvb3-JPyUfS7cufyfvmqFBOsw6BhZrGWoWnfwhv95H5Uf0bwusqGxG3448_WMidHXBeXn0k4q3qaerTk7IDT-V279QMo5RDAupedrNa8ALuStVB20Vy9Zl_T2c8P7n1AXQVoCcGqoln4j7YJ1Tlf7pbHawH8iUdDRbuF95qkM8P3zZgMdXCjW23xcQN_djjKVpPq7tOyzWPB84Sq5U3E0JFVkKhnGNJYjE6UYA6QZaXPZ2yJpeLERHg"
          />
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Daniel Aboyi</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Premium Plan</p>
          </div>
        </div>
      </div>
    </header>
  );
}
