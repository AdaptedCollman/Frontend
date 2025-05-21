import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Languages,
  Calculator,
  Atom,
  Brain,
  Menu,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import NavItem from "./navigation/NavItem";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: BookOpen,
    label: "English",
    href: "/english",
  },
  {
    icon: Languages,
    label: "Hebrew",
    href: "/hebrew",
  },
  {
    icon: Calculator,
    label: "Math",
    href: "/math",
  },
  {
    icon: Atom,
    label: "Simulations",
    href: "/simulations",
  },
  {
    icon: Brain,
    label: "Learning Advisor",
    href: "/learning-advisor",
  },
];

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
        "sticky top-0 z-30 transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      {/* Logo and collapse button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center">
            <span className="text-xl font-bold text-white hover:text-blue-400 transition-colors duration-300">
              Adapt<span className="text-blue-600 hover:text-blue-700">ED</span>
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu size={20} className="text-white" />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={location.pathname === item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* User Profile */}
      <Link to="/profile">
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <div
            className={cn(
              "flex items-center gap-3",
              isCollapsed && "justify-center"
            )}
          >
            <Avatar className="w-8 h-8 bg-blue-600">
              <AvatarFallback className="bg-blue-600 text-white">
                {user?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.name || "User Name"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Logout Button */}
      <button
        onClick={async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          logout();
          navigate("/");
        }}
        className="flex items-center gap-2 w-full p-4 border-t border-gray-200 dark:border-gray-800 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 transition-colors"
        style={{
          outline: "none",
          border: "none",
          background: "none",
          cursor: "pointer",
        }}
        aria-label="Logout"
      >
        <LogOut size={20} />
        {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
      </button>
    </aside>
  );
};

export default Sidebar;
