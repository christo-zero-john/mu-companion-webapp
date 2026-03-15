"use client";
import Icon from "./Icon";

export function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 border border-border rounded-lg transition-colors bg-black ${active ? "bg-panel-active text-white" : "text-text-secondary hover:bg-panel-active hover:text-white"}`}
    >
      <Icon name={icon} size={18} />
      <span className="font-bold text-xs tracking-wider uppercase">
        {label}
      </span>
    </button>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-[280px] bg-black border-l border-border md:border-l-0 md:border-r md:left-0 md:right-auto z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"} flex flex-col p-4`}
      >
        <div className="flex items-center justify-between px-4 py-6">
          <div className="text-text-secondary tracking-widest text-xs font-bold uppercase">
            MENU
          </div>
          <button onClick={onClose} className="md:hidden text-white">
            <span className="text-2xl">×</span>
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-3 mt-2">
          <SidebarItem icon="task-list" label="ALL TASKS" active />
          <SidebarItem icon="tracked-tasks" label="ONGOING TASKS" />
          <SidebarItem icon="completed" label="COMPLETED TASKS" />
          <SidebarItem icon="wishlist" label="WISHLISTED TASKS" />
          <SidebarItem icon="start" label="RECOMMENDED TASKS" />
          <SidebarItem icon="open" label="GET STARTED" />
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <SidebarItem icon="github" label="STAR ON GITHUB" />
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-text-secondary hover:bg-panel-active transition-colors mt-2 border border-border">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              P
            </div>
            <span className="font-semibold text-sm">PROFILE</span>
          </button>
        </div>
      </aside>
    </>
  );
}
