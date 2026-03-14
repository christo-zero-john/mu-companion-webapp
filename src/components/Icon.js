import Image from "next/image";

import completedIcon from "../../reources/icons/icon=completed.png";
import completed2Icon from "../../reources/icons/icon=completed2.png";
import copyIcon from "../../reources/icons/icon=copy.png";
import githubIcon from "../../reources/icons/icon=github.png";
import karmaPointsIcon from "../../reources/icons/icon=karma-points.png";
import menuIcon from "../../reources/icons/icon=menu.png";
import openIcon from "../../reources/icons/icon=open.png";
import searchIcon from "../../reources/icons/icon=search.png";
import startIcon from "../../reources/icons/icon=start.png";
import taskListIcon from "../../reources/icons/icon=task-list.png";
import trackedTasksIcon from "../../reources/icons/icon=tracked-tasks.png";
import wishlistIcon from "../../reources/icons/icon=wishlist.png";

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
    <Image
      src={iconSrc}
      alt={`${name} icon`}
      width={size}
      height={size}
      className={className}
    />
  );
}
