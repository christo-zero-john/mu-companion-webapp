import Icon from "./Icon";

export function SidebarItem({ icon, label, active }) {
  return (
    <button
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors ${active ? "bg-panel-active text-white" : "text-text-secondary hover:bg-panel-active hover:text-white"}`}
    >
      <Icon name={icon} size={20} />
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-[280px] h-screen bg-black border-r border-border flex flex-col p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 px-4 py-6 text-text-secondary tracking-widest text-xs font-bold uppercase">
        MENU
      </div>

      <nav className="flex-1 flex flex-col gap-1 mt-2">
        <SidebarItem icon="task-list" label="ALL TASKS" active />
        <SidebarItem icon="tracked-tasks" label="ONGOING TASKS" />
        <SidebarItem icon="completed" label="COMPLETED TASKS" />
        <SidebarItem icon="wishlist" label="WISHLISTED TASKS" />
        <SidebarItem icon="start" label="RECOMMENDED TASKS" />
        <SidebarItem icon="open" label="GET STARTED" />
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <SidebarItem icon="github" label="STAR ON GITHUB" />
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-text-secondary hover:bg-panel-active transition-colors mt-2 border border-border">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
            P
          </div>
          <span className="font-semibold text-sm">PROFILE</span>
        </button>
      </div>
    </aside>
  );
}
