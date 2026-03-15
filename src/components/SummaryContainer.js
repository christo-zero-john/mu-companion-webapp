import SectionHeader from "./SectionHeader";

export default function SummaryContainer({ title, children }) {
  return (
    <div className="bg-panel rounded-xl border border-border overflow-hidden mb-6">
      <div className="bg-panel-header px-5 py-4 flex items-center justify-between border-b border-border">
        <h2 className="text-white font-bold text-base">{title}</h2>
        <button className="text-primary font-bold text-sm hover:underline">
          View All
        </button>
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
