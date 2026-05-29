"use client";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { BarChart3, TrendingUp, Brain, Zap, Calendar, Award } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  LineChart, Line, CartesianGrid,
} from "recharts";

const monthlyData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  health: +(6 + Math.random() * 3).toFixed(1),
  mood: +(5 + Math.random() * 4).toFixed(1),
  energy: +(5 + Math.random() * 3.5).toFixed(1),
  sleep: +(5.5 + Math.random() * 3).toFixed(1),
}));

const weeklyBreakdown = [
  { week: "W1", productivity: 7.2, focus: 6.8, stress: 4.5 },
  { week: "W2", productivity: 7.8, focus: 7.5, stress: 5.2 },
  { week: "W3", productivity: 6.5, focus: 6.2, stress: 6.8 },
  { week: "W4", productivity: 8.1, focus: 8.0, stress: 3.8 },
];

const correlationData = [
  { metric: "Sleep", health: 85, mood: 90, energy: 88 },
  { metric: "Exercise", health: 75, mood: 70, energy: 80 },
  { metric: "Nutrition", health: 80, mood: 65, energy: 72 },
  { metric: "Hydration", health: 90, mood: 55, energy: 85 },
  { metric: "Mindfulness", health: 60, mood: 88, energy: 65 },
];

const streakData = [
  { day: "Mon", completed: 1 }, { day: "Tue", completed: 1 },
  { day: "Wed", completed: 1 }, { day: "Thu", completed: 0 },
  { day: "Fri", completed: 1 }, { day: "Sat", completed: 1 },
  { day: "Sun", completed: 1 },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function AnalyticsPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-7xl mx-auto">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="gradient-text">Analytics Center</span>
        </h1>
        <p className="text-[var(--color-text-muted)] mt-1">Deep insights into your health and wellness patterns</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg Health Score", value: "7.8", change: "+0.5", icon: TrendingUp, color: "#00ff88" },
          { label: "Active Streak", value: "12", unit: "days", icon: Zap, color: "#ffd700" },
          { label: "AI Insights", value: "24", unit: "generated", icon: Brain, color: "#7c3aed" },
          { label: "Best Day", value: "Saturday", unit: "highest scores", icon: Award, color: "#00d4ff" },
        ].map((card, i) => (
          <GlassCard key={i}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">{card.label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: card.color }}>{card.value}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{card.change || card.unit}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${card.color}15` }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {/* 30-Day Trend */}
      <motion.div variants={item}>
        <GlassCard hover={false}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">30-Day Health Trends</h2>
              <p className="text-sm text-[var(--color-text-muted)]">Daily metrics overview</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00d4ff]" /> Health</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#7c3aed]" /> Mood</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00ff88]" /> Energy</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ffd700]" /> Sleep</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="a2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[4, 10]} />
              <Tooltip contentStyle={{ background: "rgba(17,24,39,0.95)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "12px" }} />
              <Area type="monotone" dataKey="health" stroke="#00d4ff" fill="url(#a1)" strokeWidth={2} />
              <Area type="monotone" dataKey="mood" stroke="#7c3aed" fill="url(#a2)" strokeWidth={2} />
              <Area type="monotone" dataKey="energy" stroke="#00ff88" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
              <Area type="monotone" dataKey="sleep" stroke="#ffd700" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </motion.div>

      {/* Weekly + Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <GlassCard hover={false}>
            <h3 className="font-semibold mb-4">Weekly Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyBreakdown}>
                <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ background: "rgba(17,24,39,0.95)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "12px" }} />
                <Bar dataKey="productivity" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="focus" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="stress" fill="#ff6b2b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard hover={false}>
            <h3 className="font-semibold mb-4">Health Correlation Radar</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={correlationData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={11} />
                <Radar name="Health" dataKey="health" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.1} strokeWidth={2} />
                <Radar name="Mood" dataKey="mood" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.1} strokeWidth={2} />
                <Radar name="Energy" dataKey="energy" stroke="#00ff88" fill="#00ff88" fillOpacity={0.1} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      </div>

      {/* Streak + Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item}>
          <GlassCard hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[var(--color-accent-gold)]" />
              <h3 className="font-semibold">Weekly Streak</h3>
            </div>
            <div className="flex justify-between">
              {streakData.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      d.completed
                        ? "bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] text-white"
                        : "bg-white/5 text-[var(--color-text-muted)]"
                    }`}
                  >
                    {d.completed ? "✓" : "·"}
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)]">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold text-[var(--color-accent-gold)]">6/7</p>
              <p className="text-xs text-[var(--color-text-muted)]">days this week</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-2">
          <GlassCard hover={false}>
            <h3 className="font-semibold mb-4">Predicted Trends (Next 7 Days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={[
                { day: "Today", health: 7.8, predicted: null },
                { day: "+1d", health: null, predicted: 8.0 },
                { day: "+2d", health: null, predicted: 7.9 },
                { day: "+3d", health: null, predicted: 8.2 },
                { day: "+4d", health: null, predicted: 8.1 },
                { day: "+5d", health: null, predicted: 8.4 },
                { day: "+6d", health: null, predicted: 8.3 },
                { day: "+7d", health: null, predicted: 8.6 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[6, 10]} />
                <Tooltip contentStyle={{ background: "rgba(17,24,39,0.95)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "12px" }} />
                <Line type="monotone" dataKey="health" stroke="#00d4ff" strokeWidth={2} dot={{ fill: "#00d4ff" }} />
                <Line type="monotone" dataKey="predicted" stroke="#7c3aed" strokeWidth={2} strokeDasharray="6 3" dot={{ fill: "#7c3aed" }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2 text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00d4ff]" /> Actual</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#7c3aed]" /> AI Predicted</span>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
