import Image from "next/image";

import completedIcon from "@/assets/icons/completed.png";
import completed2Icon from "@/assets/icons/completed2.png";
import copyIcon from "@/assets/icons/copy.png";
import githubIcon from "@/assets/icons/github.png";
import karmaPointsIcon from "@/assets/icons/karma-points.png";
import menuIcon from "@/assets/icons/menu.png";
import openIcon from "@/assets/icons/open.png";
import searchIcon from "@/assets/icons/search.png";
import startIcon from "@/assets/icons/start.png";
import taskListIcon from "@/assets/icons/task-list.png";
import trackedTasksIcon from "@/assets/icons/tracked-tasks.png";
import wishlistIcon from "@/assets/icons/wishlist.png";

const iconMap = {
  completed: completedIcon,
  completed2: completed2Icon,
  copy: copyIcon,
  github: githubIcon,
  "karma-points": karmaPointsIcon,
  menu: menuIcon,
  open: openIcon,
  search: searchIcon,
  start: startIcon,
  "task-list": taskListIcon,
  "tracked-tasks": trackedTasksIcon,
  wishlist: wishlistIcon,
};

export default function Icon({ name, size = 24, className = "" }) {
  const iconSrc = iconMap[name];

  if (!iconSrc) {
    console.warn(`Icon "${name}" not found.`);
    return null;
  }

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={iconSrc}
        alt={`${name} icon`}
        fill
        className="object-contain"
      />
    </div>
  );
}
