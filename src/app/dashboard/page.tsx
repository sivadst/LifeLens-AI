"use client";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import {
  Activity,
  Brain,
  Flame,
  Droplets,
  Moon,
  TrendingUp,
  Scan,
  Dumbbell,
  Wrench,
  MessageSquare,
  Zap,
  Target,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

const weeklyData = [
  { day: "Mon", health: 7.2, energy: 6.8, focus: 7.5, mood: 7.0 },
  { day: "Tue", health: 7.5, energy: 7.2, focus: 8.0, mood: 7.3 },
  { day: "Wed", health: 6.8, energy: 6.5, focus: 7.0, mood: 6.5 },
  { day: "Thu", health: 7.8, energy: 7.5, focus: 8.2, mood: 7.8 },
  { day: "Fri", health: 8.0, energy: 7.8, focus: 7.8, mood: 8.0 },
  { day: "Sat", health: 8.5, energy: 8.0, focus: 6.5, mood: 8.5 },
  { day: "Sun", health: 8.2, energy: 7.5, focus: 6.8, mood: 8.2 },
];

const radarData = [
  { metric: "Sleep", value: 85 },
  { metric: "Nutrition", value: 72 },
  { metric: "Exercise", value: 68 },
  { metric: "Hydration", value: 90 },
  { metric: "Mental", value: 78 },
  { metric: "Focus", value: 82 },
];

const kpiCards = [
  {
    label: "Health Score",
    value: "8.4",
    sub: "/10",
    icon: Activity,
    color: "#00d4ff",
    trend: "+0.3 this week",
  },
  {
    label: "Calories Today",
    value: "1,840",
    sub: "kcal",
    icon: Flame,
    color: "#ff6b2b",
    trend: "420 remaining",
  },
  {
    label: "Water Intake",
    value: "6",
    sub: "/8 glasses",
    icon: Droplets,
    color: "#00d4ff",
    trend: "75% of daily goal",
  },
  {
    label: "Sleep Score",
    value: "7.5",
    sub: "hrs",
    icon: Moon,
    color: "#7c3aed",
    trend: "Optimal range",
  },
];

const quickActions = [
  {
    href: "/dashboard/food-vision",
    icon: Scan,
    label: "Food Vision",
    desc: "Analyze food nutrition",
    gradient: "from-[#00d4ff] to-[#0099cc]",
  },
  {
    href: "/dashboard/body-analyzer",
    icon: Dumbbell,
    label: "Body Analyzer",
    desc: "Assess body health",
    gradient: "from-[#00ff88] to-[#00cc6a]",
  },
  {
    href: "/dashboard/damage-detection",
    icon: Wrench,
    label: "Damage Detect",
    desc: "Scan device damage",
    gradient: "from-[#ff6b2b] to-[#cc5522]",
  },
  {
    href: "/dashboard/assistant",
    icon: MessageSquare,
    label: "AI Assistant",
    desc: "Chat with AI",
    gradient: "from-[#7c3aed] to-[#6025c0]",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          Welcome to <span className="gradient-text">LifeLens AI</span>
        </h1>
        <p className="text-[var(--color-text-muted)] mt-1">
          Your AI-powered intelligence dashboard
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <GlassCard key={i} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">{kpi.label}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold" style={{ color: kpi.color }}>
                    {kpi.value}
                  </span>
                  <span className="text-sm text-[var(--color-text-muted)]">{kpi.sub}</span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[var(--color-accent-green)]" />
                  {kpi.trend}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${kpi.color}15` }}
              >
                <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
              </div>
            </div>
            {/* Decorative gradient */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, transparent, ${kpi.color}, transparent)` }}
            />
          </GlassCard>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Trends */}
        <motion.div variants={item} className="lg:col-span-2">
          <GlassCard hover={false}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Health Trends</h2>
                <p className="text-sm text-[var(--color-text-muted)]">7-day overview</p>
              </div>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00d4ff]" /> Health
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#7c3aed]" /> Energy
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00ff88]" /> Focus
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00ff88" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[5, 10]} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(17,24,39,0.95)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    borderRadius: "12px",
                    fontSize: "13px",
                  }}
                />
                <Area type="monotone" dataKey="health" stroke="#00d4ff" fill="url(#gradCyan)" strokeWidth={2} />
                <Area type="monotone" dataKey="energy" stroke="#7c3aed" fill="url(#gradPurple)" strokeWidth={2} />
                <Area type="monotone" dataKey="focus" stroke="#00ff88" fill="url(#gradGreen)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Wellness Radar */}
        <motion.div variants={item}>
          <GlassCard hover={false} className="h-full">
            <h2 className="text-lg font-semibold mb-2">Wellness Radar</h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">Overall balance</p>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={11} />
                <Radar
                  dataKey="value"
                  stroke="#00d4ff"
                  fill="#00d4ff"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[var(--color-accent-gold)]" />
          AI Engines
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <GlassCard className="group relative overflow-hidden">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-cyan)] transition-colors">
                  {action.label}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  {action.desc}
                </p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div variants={item}>
        <GlassCard hover={false} glow="purple">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(124,58,237,0.15)] flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-[var(--color-accent-purple)]" />
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                AI Insight
                <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(124,58,237,0.15)] text-[var(--color-accent-purple)]">
                  New
                </span>
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] mt-1 leading-relaxed">
                Based on your recent patterns, your sleep quality correlates strongly with
                next-day productivity. Consider maintaining your current 7-8 hour sleep
                window — it&apos;s optimizing your focus scores by approximately 15%.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Target className="w-4 h-4 text-[var(--color-accent-green)]" />
                <span className="text-xs text-[var(--color-accent-green)]">
                  Confidence: 87% • Based on 30 days of data
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
