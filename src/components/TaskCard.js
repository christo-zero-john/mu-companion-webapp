import Icon from "./Icon";

export default function TaskCard({ title, hashtag, points }) {
  return (
    <div className="w-full border-b border-border flex items-center justify-between py-4 group">
      <div className="flex flex-col gap-1">
        <h3 className="text-white font-bold text-sm group-hover:text-primary transition-colors cursor-pointer">
          {title}
        </h3>
        <span className="text-text-secondary text-xs">{hashtag}</span>
      </div>
      <div className="flex items-center gap-1.5 bg-panel px-3 py-1.5 rounded-lg border border-border">
        <Icon name="karma-points" size={16} />
        <span className="text-white font-bold text-sm tracking-wide">
          {points}
        </span>
      </div>
    </div>
  );
}
