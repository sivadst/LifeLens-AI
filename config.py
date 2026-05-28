"""
LifeLens AI — Application Configuration
Loads settings from environment variables with sensible defaults.
"""
 
import os
from dotenv import load_dotenv
 
load_dotenv()
 
 
class AppConfig:
    # ── App Meta ──────────────────────────────────────────────────────────────
    APP_NAME        = "LifeLens AI"
    APP_VERSION     = "1.0.0"
    APP_DESCRIPTION = "Advanced AI-Powered Personal Analytics & Prediction Platform"
 
    # ── Database ──────────────────────────────────────────────────────────────
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///data/lifelens.db")
    DB_PATH      = os.getenv("DB_PATH", os.path.join(os.path.dirname(__file__), "data", "lifelens.db"))
 
    # ── Auth ──────────────────────────────────────────────────────────────────
    SECRET_KEY      = os.getenv("SECRET_KEY", "lifelens-secret-key-change-in-production")
    SESSION_TIMEOUT = int(os.getenv("SESSION_TIMEOUT", "3600"))  # seconds
 
    # ── ML Models ─────────────────────────────────────────────────────────────
    MODELS_DIR        = os.path.join(os.path.dirname(__file__), "models", "trained")
    RETRAIN_ON_STARTUP = os.getenv("RETRAIN_ON_STARTUP", "false").lower() == "true"
 
    # ── NLP ───────────────────────────────────────────────────────────────────
    NLP_MODEL = os.getenv("NLP_MODEL", "vader")  # 'vader' or 'transformers'
 
    # ── Reports ───────────────────────────────────────────────────────────────
    REPORTS_DIR = os.path.join(os.path.dirname(__file__), "reports")
 
    # ── Thresholds ────────────────────────────────────────────────────────────
    BURNOUT_THRESHOLD     = float(os.getenv("BURNOUT_THRESHOLD", "0.65"))
    HIGH_STRESS_THRESHOLD = float(os.getenv("HIGH_STRESS_THRESHOLD", "7.0"))
    LOW_SLEEP_THRESHOLD   = float(os.getenv("LOW_SLEEP_THRESHOLD", "6.0"))
 
    # ── Feature Columns ───────────────────────────────────────────────────────
    DAILY_LOG_FEATURES = [
        "sleep_hours",
        "mood_score",
        "study_hours",
        "exercise_minutes",
        "screen_time_hours",
        "focus_score",
        "stress_level",
        "productivity_score",
        "water_intake_glasses",
        "caffeine_mg",
        "expenses",
    ]
 
    # ── Metrics Display Names ─────────────────────────────────────────────────
    METRIC_LABELS = {
        "sleep_hours":          "Sleep (hrs)",
        "mood_score":           "Mood Score",
        "study_hours":          "Study (hrs)",
        "exercise_minutes":     "Exercise (min)",
        "screen_time_hours":    "Screen Time (hrs)",
        "focus_score":          "Focus Score",
        "stress_level":         "Stress Level",
        "productivity_score":   "Productivity",
        "water_intake_glasses": "Water (glasses)",
        "caffeine_mg":          "Caffeine (mg)",
        "expenses":             "Expenses (₹)",
    }
 
 
class ThemeConfig:
    # Neon dark palette
    BG_PRIMARY    = "#0a0e1a"
    BG_SECONDARY  = "#0d1526"
    BG_CARD       = "#111827"
    ACCENT_BLUE   = "#00d4ff"
    ACCENT_PURPLE = "#7c3aed"
    ACCENT_GREEN  = "#00ff88"
    ACCENT_PINK   = "#ff2d78"
    ACCENT_ORANGE = "#ff6b2b"
    TEXT_PRIMARY  = "#e2e8f0"
    TEXT_MUTED    = "#64748b"
    BORDER        = "#1e293b"
    GLOW_BLUE     = "rgba(0, 212, 255, 0.3)"
    GLOW_PURPLE   = "rgba(124, 58, 237, 0.3)"
 
    # Plotly template overrides
    PLOTLY_TEMPLATE = "plotly_dark"
    CHART_COLORS    = [
        "#00d4ff", "#7c3aed", "#00ff88",
        "#ff2d78", "#ff6b2b", "#ffd700",
    ]
 