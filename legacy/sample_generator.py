"""
LifeLens AI — Sample Data Generator
Generates 90 days of realistic, correlated personal analytics data.
Patterns: weekday/weekend variation, stress-productivity anticorrelation,
sleep-mood correlation, exercise-focus correlation.
"""

import random
import math
from datetime import date, timedelta
from typing import List, Dict


def _sigmoid(x: float) -> float:
    return 1 / (1 + math.exp(-x))


def generate_sample_logs(user_id: int, days: int = 90) -> List[Dict]:
    """
    Returns a list of daily log dicts with realistic correlated values.
    Simulates a grad student / knowledge worker lifecycle:
    - Higher stress mid-week and near month-end (deadline pressure)
    - Better sleep on weekends
    - Exercise improves focus
    - Screen time inversely correlates with productivity
    """
    random.seed(user_id * 42)  # reproducible per user
    records = []
    today = date.today()

    # Base personality traits (vary per user)
    base_sleep      = random.uniform(6.5, 7.5)
    base_mood       = random.uniform(6.0, 7.5)
    base_stress     = random.uniform(4.0, 6.0)
    base_study      = random.uniform(4.0, 7.0)
    base_exercise   = random.uniform(20, 45)
    base_screen     = random.uniform(3.0, 5.5)
    base_focus      = random.uniform(5.5, 7.0)
    base_prod       = random.uniform(5.0, 7.5)
    base_water      = random.uniform(6, 9)
    base_caffeine   = random.uniform(80, 200)
    base_expenses   = random.uniform(200, 600)

    for i in range(days):
        log_date = today - timedelta(days=days - i)
        weekday  = log_date.weekday()          # 0=Mon … 6=Sun
        is_weekend = weekday >= 5
        week_num   = i // 7
        day_of_month = log_date.day

        # ── Stress drivers ─────────────────────────────────────────────────────
        # Peaks on Wed/Thu (mid-week) and last 5 days of month
        mid_week_stress  = max(0, (3 - abs(weekday - 3)) * 0.3)
        deadline_stress  = 0.5 if day_of_month >= 26 else 0
        long_term_trend  = math.sin(i / 30 * math.pi) * 0.8  # cyclical burnout
        stress = (
            base_stress
            + mid_week_stress
            + deadline_stress
            + long_term_trend
            + random.gauss(0, 0.5)
        )
        stress = max(1.0, min(10.0, stress))

        # ── Sleep ──────────────────────────────────────────────────────────────
        weekend_bonus = 1.2 if is_weekend else 0.0
        sleep = base_sleep + weekend_bonus - (stress - 5) * 0.15 + random.gauss(0, 0.4)
        sleep = max(3.5, min(10.0, sleep))

        # ── Mood (depends on sleep and stress) ────────────────────────────────
        mood = (
            base_mood
            + (sleep - base_sleep) * 0.4
            - (stress - base_stress) * 0.3
            + random.gauss(0, 0.5)
        )
        mood = max(1.0, min(10.0, mood))

        # ── Exercise (less on high-stress days, more on weekends) ─────────────
        exercise = (
            base_exercise
            + (10 if is_weekend else 0)
            - max(0, stress - 6) * 3
            + random.gauss(0, 8)
        )
        exercise = max(0, min(120, exercise))

        # ── Focus (sleep + exercise improve focus, stress hurts it) ───────────
        focus = (
            base_focus
            + (sleep - 7) * 0.4
            + exercise / 60 * 0.5
            - (stress - 5) * 0.25
            + random.gauss(0, 0.5)
        )
        focus = max(1.0, min(10.0, focus))

        # ── Study hours (less on weekends, stress can help or hurt) ───────────
        study = (
            (base_study * 0.4 if is_weekend else base_study)
            + min(stress - 5, 2) * 0.3  # mild stress → more study
            + random.gauss(0, 0.8)
        )
        study = max(0, min(14, study))

        # ── Screen time (inversely related to study & exercise) ────────────────
        screen = (
            base_screen
            + (1.5 if is_weekend else 0)
            - study * 0.15
            + random.gauss(0, 0.5)
        )
        screen = max(0.5, min(12, screen))

        # ── Productivity (focus + sleep + mood - stress - screen_excess) ───────
        screen_penalty = max(0, screen - 4) * 0.3
        productivity = (
            base_prod
            + (focus - base_focus) * 0.4
            + (sleep - base_sleep) * 0.3
            + (mood - base_mood) * 0.2
            - (stress - base_stress) * 0.3
            - screen_penalty
            + random.gauss(0, 0.5)
        )
        productivity = max(1.0, min(10.0, productivity))

        # ── Water & caffeine ───────────────────────────────────────────────────
        water     = max(2, min(15, base_water + random.gauss(0, 1)))
        caffeine  = max(0, min(500, base_caffeine + stress * 10 + random.gauss(0, 30)))

        # ── Expenses (higher on weekends) ─────────────────────────────────────
        expenses = max(0, base_expenses * (1.4 if is_weekend else 1.0) + random.gauss(0, 80))

        records.append({
            "log_date":             log_date.isoformat(),
            "sleep_hours":          round(sleep, 1),
            "mood_score":           round(mood, 1),
            "study_hours":          round(study, 1),
            "exercise_minutes":     round(exercise, 0),
            "screen_time_hours":    round(screen, 1),
            "focus_score":          round(focus, 1),
            "stress_level":         round(stress, 1),
            "productivity_score":   round(productivity, 1),
            "water_intake_glasses": round(water, 0),
            "caffeine_mg":          round(caffeine, 0),
            "expenses":             round(expenses, 2),
            "notes":                "",
        })

    return records


def generate_sample_csv(filepath: str, days: int = 90):
    """Write sample data CSV to filepath."""
    import csv
    records = generate_sample_logs(user_id=1, days=days)
    if not records:
        return
    with open(filepath, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=records[0].keys())
        writer.writeheader()
        writer.writerows(records)


if __name__ == "__main__":
    import os
    out = os.path.join(os.path.dirname(__file__), "samples", "sample_90days.csv")
    generate_sample_csv(out)
    print(f"Sample data written to {out}")