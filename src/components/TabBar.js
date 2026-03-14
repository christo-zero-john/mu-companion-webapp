export default function TabBar({
  tabs = ["All Tasks", "Ongoing", "Starred", "Completed"],
  activeTab = "All Tasks",
}) {
  return (
    <div className="flex items-center gap-6 border-b border-border w-full pt-4 overflow-x-auto hide-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`pb-3 relative whitespace-nowrap text-sm font-semibold transition-colors ${activeTab === tab ? "text-primary" : "text-text-secondary hover:text-white"}`}
        >
          {tab}
          {activeTab === tab && (
            <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-primary rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  );
}
