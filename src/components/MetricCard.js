import Icon from "./Icon";

export default function MetricCard({ icon, iconBgColor, value, label }) {
  return (
    <div className="flex-1 min-w-[105px] bg-[#1E1E20] rounded-xl p-5 flex flex-col items-center justify-center gap-4 border border-border">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor}`}
      >
        <Icon name={icon} size={24} />
      </div>
      <div className="text-2xl font-bold text-white leading-none">{value}</div>
      {label && (
        <div className="text-xs text-text-secondary -mt-2 font-medium">
          {label}
        </div>
      )}
    </div>
  );
}
