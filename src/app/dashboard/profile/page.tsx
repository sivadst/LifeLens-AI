"use client";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import GlassCard from "@/components/ui/GlassCard";
import {
  User, Mail, Calendar, Shield, LogOut,
  Scan, Dumbbell, Wrench, MessageSquare,
  Download, FileText, TrendingUp, Clock,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();

  const activityTimeline = [
    { time: "Today, 2:30 PM", action: "Food Vision Analysis", desc: "Analyzed Grilled Chicken Salad", icon: Scan, color: "#00d4ff" },
    { time: "Today, 11:00 AM", action: "Body Analysis", desc: "Updated health metrics", icon: Dumbbell, color: "#00ff88" },
    { time: "Yesterday, 4:15 PM", action: "AI Chat Session", desc: "Discussed sleep optimization", icon: MessageSquare, color: "#7c3aed" },
    { time: "Yesterday, 10:00 AM", action: "Damage Detection", desc: "Scanned laptop screen", icon: Wrench, color: "#ff6b2b" },
    { time: "2 days ago", action: "Food Vision Analysis", desc: "Analyzed breakfast smoothie", icon: Scan, color: "#00d4ff" },
  ];

  const stats = [
    { label: "Food Scans", value: "47", icon: Scan, color: "#00d4ff" },
    { label: "Body Analyses", value: "12", icon: Dumbbell, color: "#00ff88" },
    { label: "Damage Reports", value: "8", icon: Wrench, color: "#ff6b2b" },
    { label: "AI Conversations", value: "156", icon: MessageSquare, color: "#7c3aed" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl mx-auto">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="gradient-text">Profile</span>
        </h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div variants={item}>
        <GlassCard hover={false} glow="cyan">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center text-4xl font-bold text-white">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold">{session?.user?.name || "User"}</h2>
              <div className="flex flex-col sm:flex-row gap-3 mt-2 text-sm text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {session?.user?.email}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Member since 2025</span>
                <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-[var(--color-accent-green)]" /> Pro Plan</span>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <GlassCard key={i}>
            <div className="text-center">
              <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{stat.label}</p>
            </div>
          </GlassCard>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <motion.div variants={item} className="lg:col-span-2">
          <GlassCard hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[var(--color-accent-cyan)]" />
              <h3 className="font-semibold">Activity Timeline</h3>
            </div>
            <div className="space-y-4">
              {activityTimeline.map((act, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${act.color}15` }}>
                    <act.icon className="w-4 h-4" style={{ color: act.color }} />
                  </div>
                  <div className="flex-1 pb-4 border-b border-white/5 last:border-0">
                    <p className="text-sm font-medium">{act.action}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{act.desc}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{act.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Export & Insights */}
        <motion.div variants={item} className="space-y-4">
          <GlassCard>
            <div className="flex items-center gap-2 mb-3">
              <Download className="w-5 h-5 text-[var(--color-accent-cyan)]" />
              <h3 className="font-semibold">Export Reports</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: "Nutrition Report", desc: "Last 30 days", icon: FileText },
                { label: "Health Summary", desc: "Monthly overview", icon: TrendingUp },
                { label: "Full AI Report", desc: "All analyses", icon: FileText },
              ].map((report, i) => (
                <button
                  key={i}
                  onClick={() => alert("PDF export feature — connect Gemini API key for full functionality")}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[var(--color-accent-cyan)] transition-all text-left"
                >
                  <report.icon className="w-4 h-4 text-[var(--color-accent-cyan)]" />
                  <div>
                    <p className="text-sm font-medium">{report.label}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{report.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard glow="purple">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-[rgba(124,58,237,0.15)] flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-[var(--color-accent-purple)]" />
              </div>
              <h3 className="font-semibold">AI Insights</h3>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                Your health score has improved by <span className="text-[var(--color-accent-green)] font-bold">12%</span> over the last month.
                Keep maintaining your sleep schedule!
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
