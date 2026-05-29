"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import ImageUpload from "@/components/ui/ImageUpload";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Scan,
  Apple,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Heart,
  Dumbbell,
  Clock,
  Lightbulb,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface FoodResult {
  foodName: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  healthScore: number;
  micronutrients: Record<string, string>;
  fitnessSuggestions: string[];
  dietRecommendations: string[];
  gymRecommendations: string[];
  mealTimingSuggestions: string[];
  reasoning: string;
}

export default function FoodVisionPage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FoodResult | null>(null);

  const analyzeFood = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/food-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      console.error("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const macroData = result
    ? [
        { name: "Protein", value: result.protein, color: "#00d4ff" },
        { name: "Carbs", value: result.carbs, color: "#7c3aed" },
        { name: "Fat", value: result.fat, color: "#ff6b2b" },
        { name: "Fiber", value: result.fiber, color: "#00ff88" },
      ]
    : [];

  const microData = result
    ? Object.entries(result.micronutrients || {}).map(([key, val]) => ({
        name: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
        value: parseInt(val) || 0,
      }))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#0099cc] flex items-center justify-center">
            <Scan className="w-5 h-5 text-white" />
          </div>
          <span className="gradient-text">Food Vision Engine</span>
        </h1>
        <p className="text-[var(--color-text-muted)] mt-2">
          Upload a food image for instant AI-powered nutritional analysis
        </p>
      </div>

      {/* Upload Section */}
      <GlassCard hover={false}>
        <ImageUpload
          onImageSelect={(b64) => setImage(b64)}
          label="Drop your food image here"
        />
        {image && !loading && !result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex justify-center"
          >
            <button onClick={analyzeFood} className="btn-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Analyze with AI
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </GlassCard>

      {/* Loading */}
      {loading && (
        <GlassCard hover={false}>
          <LoadingSpinner text="AI is analyzing your food..." size="lg" />
        </GlassCard>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Food Name & Score */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassCard glow="cyan" className="md:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <Apple className="w-6 h-6 text-[var(--color-accent-green)]" />
                  <div>
                    <h2 className="text-2xl font-bold">{result.foodName}</h2>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Confidence: {(result.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {[
                    { label: "Calories", val: `${result.calories}`, unit: "kcal", icon: Flame, color: "#ff6b2b" },
                    { label: "Protein", val: `${result.protein}g`, unit: "", icon: Beef, color: "#00d4ff" },
                    { label: "Carbs", val: `${result.carbs}g`, unit: "", icon: Wheat, color: "#7c3aed" },
                    { label: "Fat", val: `${result.fat}g`, unit: "", icon: Droplets, color: "#ffd700" },
                  ].map((m, i) => (
                    <div key={i} className="text-center">
                      <m.icon className="w-5 h-5 mx-auto mb-1" style={{ color: m.color }} />
                      <p className="text-xl font-bold" style={{ color: m.color }}>{m.val}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{m.label}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard glow="green">
                <div className="text-center">
                  <Heart className="w-8 h-8 text-[var(--color-accent-green)] mx-auto mb-2" />
                  <p className="text-sm text-[var(--color-text-muted)]">Health Score</p>
                  <p className="text-5xl font-bold text-[var(--color-accent-green)] mt-1">
                    {result.healthScore}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">/10</p>
                </div>
              </GlassCard>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard hover={false}>
                <h3 className="font-semibold mb-4">Macro Breakdown</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {macroData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(17,24,39,0.95)",
                        border: "1px solid rgba(0,212,255,0.2)",
                        borderRadius: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {macroData.map((m, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                      {m.name}: {m.value}g
                    </span>
                  ))}
                </div>
              </GlassCard>

              <GlassCard hover={false}>
                <h3 className="font-semibold mb-4">Micronutrients</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={microData} layout="vertical">
                    <XAxis type="number" stroke="#64748b" fontSize={11} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={80} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(17,24,39,0.95)",
                        border: "1px solid rgba(0,212,255,0.2)",
                        borderRadius: "12px",
                      }}
                      formatter={(value: any) => [`${value}% DV`, "Amount"]}
                    />
                    <Bar dataKey="value" fill="#00d4ff" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>

            {/* Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Fitness Suggestions", items: result.fitnessSuggestions, icon: Dumbbell, color: "#00d4ff" },
                { title: "Diet Recommendations", items: result.dietRecommendations, icon: Apple, color: "#00ff88" },
                { title: "Gym Pairing", items: result.gymRecommendations, icon: Dumbbell, color: "#7c3aed" },
                { title: "Meal Timing", items: result.mealTimingSuggestions, icon: Clock, color: "#ff6b2b" },
              ].map((section, i) => (
                <GlassCard key={i}>
                  <div className="flex items-center gap-2 mb-3">
                    <section.icon className="w-5 h-5" style={{ color: section.color }} />
                    <h3 className="font-semibold">{section.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {(section.items || []).map((tip, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                        <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: section.color }} />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              ))}
            </div>

            {/* AI Reasoning */}
            <GlassCard glow="purple">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-[var(--color-accent-gold)] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">AI Reasoning</h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    {result.reasoning}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
