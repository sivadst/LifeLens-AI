"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Dumbbell, Heart, Flame, Droplets, Moon, AlertTriangle,
  ChevronRight, Target, TrendingUp, Sparkles, Activity
} from "lucide-react";
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip
} from "recharts";

interface BodyResult {
  bmi: number;
  bodyCategory: string;
  healthScore: number;
  dailyCalories: number;
  hydrationRecommendation: number;
  sleepRecommendation: string;
  healthRisks: string[];
  aiRoadmap: string[];
  macroSplit: { protein: number; carbs: number; fat: number };
}

export default function BodyAnalyzerPage() {
  const [form, setForm] = useState({
    height: 170, weight: 70, age: 25, gender: "male",
    activityLevel: "moderate", sleepDuration: 7, waterIntake: 8,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BodyResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/body-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
    } catch { /* handled */ }
    finally { setLoading(false); }
  };

  const bmiColor = result
    ? result.bmi < 18.5 ? "#ff6b2b"
    : result.bmi < 25 ? "#00ff88"
    : result.bmi < 30 ? "#ffd700"
    : "#ff2d78"
    : "#00d4ff";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00cc6a] flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <span className="gradient-text">AI Body Analyzer</span>
        </h1>
        <p className="text-[var(--color-text-muted)] mt-2">Enter your details for a comprehensive health assessment</p>
      </div>

      {/* Input Form */}
      <GlassCard hover={false}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Height (cm)", key: "height", min: 100, max: 250, step: 1 },
            { label: "Weight (kg)", key: "weight", min: 30, max: 300, step: 0.5 },
            { label: "Age", key: "age", min: 10, max: 120, step: 1 },
            { label: "Sleep (hrs)", key: "sleepDuration", min: 1, max: 16, step: 0.5 },
            { label: "Water (glasses)", key: "waterIntake", min: 0, max: 20, step: 1 },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-sm text-[var(--color-text-muted)] mb-1 block">{field.label}</label>
              <input
                type="number"
                value={form[field.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.key]: parseFloat(e.target.value) })}
                min={field.min} max={field.max} step={field.step}
                className="input-glass"
              />
            </div>
          ))}
          <div>
            <label className="text-sm text-[var(--color-text-muted)] mb-1 block">Gender</label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="input-glass"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-[var(--color-text-muted)] mb-1 block">Activity Level</label>
            <select
              value={form.activityLevel}
              onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}
              className="input-glass"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Analyze Body
            </button>
          </div>
        </form>
      </GlassCard>

      {loading && <GlassCard hover={false}><LoadingSpinner text="Analyzing your body metrics..." size="lg" /></GlassCard>}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "BMI", value: result.bmi.toString(), sub: result.bodyCategory, icon: Activity, color: bmiColor },
                { label: "Health Score", value: result.healthScore.toString(), sub: "/10", icon: Heart, color: "#00ff88" },
                { label: "Daily Calories", value: result.dailyCalories.toLocaleString(), sub: "kcal", icon: Flame, color: "#ff6b2b" },
                { label: "Hydration", value: `${result.hydrationRecommendation}L`, sub: "per day", icon: Droplets, color: "#00d4ff" },
              ].map((m, i) => (
                <GlassCard key={i}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${m.color}15` }}>
                      <m.icon className="w-5 h-5" style={{ color: m.color }} />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)]">{m.label}</p>
                      <p className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{m.sub}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* BMI Gauge & Macros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard hover={false}>
                <h3 className="font-semibold mb-4">BMI Gauge</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{ value: Math.min(result.bmi, 40), fill: bmiColor }]} startAngle={180} endAngle={0}>
                    <RadialBar dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <p className="text-center text-3xl font-bold mt-[-40px]" style={{ color: bmiColor }}>{result.bmi}</p>
                <p className="text-center text-sm text-[var(--color-text-muted)]">{result.bodyCategory}</p>
              </GlassCard>

              <GlassCard hover={false}>
                <h3 className="font-semibold mb-4">Daily Macro Split</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { name: "Protein", value: result.macroSplit.protein, fill: "#00d4ff" },
                    { name: "Carbs", value: result.macroSplit.carbs, fill: "#7c3aed" },
                    { name: "Fat", value: result.macroSplit.fat, fill: "#ff6b2b" },
                  ]}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ background: "rgba(17,24,39,0.95)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "12px" }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {[
                        { fill: "#00d4ff" },
                        { fill: "#7c3aed" },
                        { fill: "#ff6b2b" },
                      ].map((entry, i) => (
                        <motion.rect key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-2 text-xs text-[var(--color-text-muted)]">
                  <span>Protein: {result.macroSplit.protein}g</span>
                  <span>Carbs: {result.macroSplit.carbs}g</span>
                  <span>Fat: {result.macroSplit.fat}g</span>
                </div>
              </GlassCard>
            </div>

            {/* Sleep & Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard>
                <div className="flex items-center gap-3 mb-3">
                  <Moon className="w-5 h-5 text-[var(--color-accent-purple)]" />
                  <h3 className="font-semibold">Sleep Recommendation</h3>
                </div>
                <p className="text-2xl font-bold text-[var(--color-accent-purple)]">{result.sleepRecommendation}</p>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">Recommended for your age group</p>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-[var(--color-accent-orange)]" />
                  <h3 className="font-semibold">Health Risks</h3>
                </div>
                {result.healthRisks.length > 0 ? (
                  <ul className="space-y-2">
                    {result.healthRisks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                        <ChevronRight className="w-4 h-4 text-[var(--color-accent-orange)] flex-shrink-0 mt-0.5" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[var(--color-accent-green)]">No significant risks detected ✓</p>
                )}
              </GlassCard>
            </div>

            {/* AI Roadmap */}
            <GlassCard glow="purple" hover={false}>
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-[var(--color-accent-purple)]" />
                <h3 className="text-lg font-semibold">AI Improvement Roadmap</h3>
              </div>
              <div className="space-y-3">
                {result.aiRoadmap.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#00d4ff] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <p className="text-sm text-[var(--color-text-muted)]">{step}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
