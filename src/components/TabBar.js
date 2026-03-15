export default function TabBar({
  tabs = ["All Tasks", "Ongoing", "Starred", "Completed"],
  activeTab = "All Tasks",
}) {
  return (
    <div className="flex items-center gap-3 w-full py-4 overflow-x-auto hide-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-5 py-2.5 rounded-lg whitespace-nowrap text-sm font-semibold transition-all ${
            activeTab === tab
              ? "bg-white text-[#111827] shadow-sm"
              : "text-text-secondary hover:text-white"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
