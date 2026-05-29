"use client";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Bell, Search } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b border-white/5"
      style={{
        background: "rgba(6, 8, 15, 0.8)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search features..."
            className="input-glass pl-10 py-2.5 text-sm"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/5 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-accent-cyan)]" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center text-white text-sm font-bold">
            {session?.user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {session?.user?.name || "User"}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {session?.user?.email || ""}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-accent-pink)] hover:bg-white/5 transition-all"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
