export default function SectionHeader({
  title,
  actionText = "View All",
  onActionClick,
  className = "",
}) {
  return (
    <div
      className={`flex items-center justify-between w-full py-4 ${className}`}
    >
      <h2 className="text-white font-semibold text-lg">{title}</h2>
      {actionText && (
        <button
          onClick={onActionClick}
          className="text-primary font-semibold text-sm hover:underline transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
