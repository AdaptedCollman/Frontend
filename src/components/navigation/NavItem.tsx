import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSimulation } from "@/context/SimulationContext";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  href,
  isActive,
  isCollapsed,
}) => {
  const navigate = useNavigate();
  const { isInSimulation, setShowNavigationModal, setPendingNavigation } =
    useSimulation();

  const handleClick = (e: React.MouseEvent) => {
    if (isInSimulation && !isActive) {
      e.preventDefault();
      setPendingNavigation(href);
      setShowNavigationModal(true);
    }
  };

  return (
    <Link
      to={href}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 mx-2 rounded-lg transition-all duration-200",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "group relative",
        isActive && [
          "bg-blue-50 dark:bg-blue-950",
          "text-blue-600 dark:text-blue-400",
          "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2",
          "before:h-8 before:w-1 before:rounded-r-full before:bg-blue-600",
        ]
      )}
    >
      <Icon
        size={20}
        className={cn(
          "shrink-0",
          isActive
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-400"
        )}
      />
      {!isCollapsed && (
        <span
          className={cn(
            "text-sm font-medium",
            isActive
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-300"
          )}
        >
          {label}
        </span>
      )}
    </Link>
  );
};

export default NavItem;
