"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Scan,
  Dumbbell,
  Wrench,
  MessageSquare,
  BarChart3,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/food-vision", icon: Scan, label: "Food Vision" },
  { href: "/dashboard/body-analyzer", icon: Dumbbell, label: "Body Analyzer" },
  { href: "/dashboard/damage-detection", icon: Wrench, label: "Damage Detect" },
  { href: "/dashboard/assistant", icon: MessageSquare, label: "AI Assistant" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
      style={{
        background: "rgba(6, 8, 15, 0.95)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden"
          >
            <h1 className="text-lg font-bold gradient-text">LifeLens AI</h1>
            <p className="text-[10px] text-[var(--color-text-muted)] -mt-0.5">
              Intelligence Platform
            </p>
          </motion.div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-[rgba(0,212,255,0.12)] to-[rgba(124,58,237,0.08)] text-[var(--color-accent-cyan)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.03]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 w-[3px] h-8 rounded-r-full bg-[var(--color-accent-cyan)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive
                      ? "text-[var(--color-accent-cyan)]"
                      : "group-hover:text-[var(--color-accent-cyan)]"
                  } transition-colors`}
                />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-4 border-t border-white/5 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-accent-cyan)] transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>
    </motion.aside>
  );
}
