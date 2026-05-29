"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import ImageUpload from "@/components/ui/ImageUpload";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Wrench, AlertTriangle, Shield, DollarSign,
  ChevronRight, Sparkles, CheckCircle, XCircle, Info
} from "lucide-react";

interface Defect {
  type: string;
  severity: string;
  location: string;
  description: string;
}

interface DamageResult {
  deviceType: string;
  overallCondition: string;
  defects: Defect[];
  severityScore: number;
  repairDifficulty: string;
  estimatedCostRange: string;
  maintenanceAdvice: string[];
  preventionTips: string[];
}

export default function DamageDetectionPage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DamageResult | null>(null);

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/damage-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      setResult(await res.json());
    } catch { /* handled */ }
    finally { setLoading(false); }
  };

  const severityColor = (sev: string) => {
    switch (sev.toLowerCase()) {
      case "critical": return "#ff2d78";
      case "high": return "#ff6b2b";
      case "medium": return "#ffd700";
      case "low": return "#00ff88";
      default: return "#64748b";
    }
  };

  const conditionColor = result
    ? result.overallCondition.includes("Severe") || result.overallCondition.includes("Critical")
      ? "#ff2d78"
      : result.overallCondition.includes("Moderate")
      ? "#ffd700"
      : "#00ff88"
    : "#00d4ff";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b2b] to-[#cc5522] flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="gradient-text-warm">AI Damage Detection</span>
        </h1>
        <p className="text-[var(--color-text-muted)] mt-2">Upload a device image for AI-powered damage assessment</p>
      </div>

      <GlassCard hover={false}>
        <ImageUpload onImageSelect={(b64) => setImage(b64)} label="Drop your device image here" />
        {image && !loading && !result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex justify-center">
            <button onClick={analyze} className="btn-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Scan for Damage <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </GlassCard>

      {loading && (
        <GlassCard hover={false}>
          <div className="relative overflow-hidden rounded-xl">
            <LoadingSpinner text="AI is scanning for damage..." size="lg" />
            <div className="scan-line" />
          </div>
        </GlassCard>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Device Type", value: result.deviceType, icon: Info, color: "#00d4ff" },
                { label: "Condition", value: result.overallCondition, icon: result.overallCondition.includes("Good") || result.overallCondition.includes("Excellent") ? CheckCircle : XCircle, color: conditionColor },
                { label: "Severity", value: `${result.severityScore}/10`, icon: AlertTriangle, color: result.severityScore > 7 ? "#ff2d78" : result.severityScore > 4 ? "#ffd700" : "#00ff88" },
                { label: "Repair Cost", value: result.estimatedCostRange, icon: DollarSign, color: "#ffd700" },
              ].map((m, i) => (
                <GlassCard key={i}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${m.color}15` }}>
                      <m.icon className="w-5 h-5" style={{ color: m.color }} />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)]">{m.label}</p>
                      <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Defects List */}
            <GlassCard hover={false}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[var(--color-accent-orange)]" />
                Detected Defects ({result.defects.length})
              </h3>
              <div className="space-y-3">
                {result.defects.map((defect, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-4"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                      style={{ background: severityColor(defect.severity), boxShadow: `0 0 10px ${severityColor(defect.severity)}40` }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{defect.type}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: `${severityColor(defect.severity)}20`, color: severityColor(defect.severity) }}
                        >
                          {defect.severity}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)]">{defect.description}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">📍 {defect.location}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Advice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard>
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="w-5 h-5 text-[var(--color-accent-cyan)]" />
                  <h3 className="font-semibold">Maintenance Advice</h3>
                </div>
                <ul className="space-y-2">
                  {result.maintenanceAdvice.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                      <ChevronRight className="w-4 h-4 text-[var(--color-accent-cyan)] flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-[var(--color-accent-green)]" />
                  <h3 className="font-semibold">Prevention Tips</h3>
                </div>
                <ul className="space-y-2">
                  {result.preventionTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                      <ChevronRight className="w-4 h-4 text-[var(--color-accent-green)] flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
