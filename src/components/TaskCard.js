import Icon from "./Icon";

export default function TaskCard({ title, hashtag, points, isOdd }) {
  return (
    <div
      className={`w-full flex items-center justify-between p-4 transition-colors ${isOdd ? "bg-card-odd" : "bg-card-even"}`}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-white font-bold text-sm">{title}</h3>
        <span className="text-text-secondary text-xs font-medium">
          {hashtag}
        </span>
      </div>
      <div className="flex items-center h-full">
        <div className="flex items-center gap-1.5 bg-badge-bg p-3 aspect-square rounded-lg border border-border">
          <Icon name="karma-points" size={16} />
          <span className="text-white font-bold text-sm tracking-wide">
            {points}
          </span>
        </div>
      </div>
    </div>
  );
}
