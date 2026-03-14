import Icon from "./Icon";

export default function MetricCard({ icon, iconBgColor, value, label }) {
  return (
    <div className="flex-1 min-w-[105px] bg-panel rounded-xl p-4 flex flex-col items-start justify-between gap-6 border border-border">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgColor}`}
      >
        <Icon name={icon} size={20} />
      </div>
      <div>
        <div className="text-xl font-bold text-white leading-none">{value}</div>
        {label && (
          <div className="text-xs text-text-secondary mt-1">{label}</div>
        )}
      </div>
    </div>
  );
}
