"""
LifeLens AI — Database Manager
Handles all SQLite operations: schema creation, CRUD for users,
daily logs, journal entries, and predictions.
"""

import sqlite3
import os
import hashlib
import secrets
from datetime import datetime, date
from typing import Optional, List, Dict, Any
import pandas as pd


class DatabaseManager:
    """Manages SQLite database connections and all CRUD operations."""

    def __init__(self, db_url: str = None):
        # Support both raw path and sqlite:/// URL
        if db_url and db_url.startswith("sqlite:///"):
            self.db_path = db_url.replace("sqlite:///", "")
        else:
            self.db_path = db_url or os.path.join(
                os.path.dirname(os.path.dirname(__file__)), "data", "lifelens.db"
            )
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA foreign_keys=ON")
        return conn

    # ─────────────────────────────────────────────
    # Schema Initialization
    # ─────────────────────────────────────────────
    def initialize_tables(self):
        """Create all tables if they don't exist."""
        with self._connect() as conn:
            conn.executescript("""
                -- Users table
                CREATE TABLE IF NOT EXISTS users (
                    id          INTEGER PRIMARY KEY AUTOINCREMENT,
                    username    TEXT    UNIQUE NOT NULL,
                    email       TEXT    UNIQUE NOT NULL,
                    password_hash TEXT  NOT NULL,
                    salt        TEXT    NOT NULL,
                    created_at  TEXT    DEFAULT (datetime('now')),
                    last_login  TEXT,
                    avatar_color TEXT   DEFAULT '#00d4ff'
                );

                -- Daily log entries
                CREATE TABLE IF NOT EXISTS daily_logs (
                    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id              INTEGER NOT NULL,
                    log_date             TEXT    NOT NULL,
                    sleep_hours          REAL    DEFAULT 0,
                    mood_score           REAL    DEFAULT 5,
                    study_hours          REAL    DEFAULT 0,
                    exercise_minutes     REAL    DEFAULT 0,
                    screen_time_hours    REAL    DEFAULT 0,
                    focus_score          REAL    DEFAULT 5,
                    stress_level         REAL    DEFAULT 5,
                    productivity_score   REAL    DEFAULT 5,
                    water_intake_glasses REAL    DEFAULT 8,
                    caffeine_mg          REAL    DEFAULT 0,
                    expenses             REAL    DEFAULT 0,
                    notes                TEXT    DEFAULT '',
                    created_at           TEXT    DEFAULT (datetime('now')),
                    FOREIGN KEY (user_id) REFERENCES users(id),
                    UNIQUE(user_id, log_date)
                );

                -- Journal entries (for NLP analysis)
                CREATE TABLE IF NOT EXISTS journal_entries (
                    id             INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id        INTEGER NOT NULL,
                    entry_date     TEXT    NOT NULL,
                    content        TEXT    NOT NULL,
                    sentiment_score REAL,
                    sentiment_label TEXT,
                    emotional_tone TEXT,
                    stress_indicators TEXT,
                    word_count     INTEGER DEFAULT 0,
                    created_at     TEXT    DEFAULT (datetime('now')),
                    FOREIGN KEY (user_id) REFERENCES users(id)
                );

                -- ML Predictions cache
                CREATE TABLE IF NOT EXISTS predictions (
                    id              INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id         INTEGER NOT NULL,
                    prediction_date TEXT    NOT NULL,
                    model_type      TEXT    NOT NULL,
                    prediction_value REAL,
                    confidence      REAL,
                    features_used   TEXT,
                    created_at      TEXT    DEFAULT (datetime('now')),
                    FOREIGN KEY (user_id) REFERENCES users(id)
                );

                -- Habits tracker
                CREATE TABLE IF NOT EXISTS habits (
                    id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id      INTEGER NOT NULL,
                    habit_name   TEXT    NOT NULL,
                    habit_date   TEXT    NOT NULL,
                    completed    INTEGER DEFAULT 0,
                    created_at   TEXT    DEFAULT (datetime('now')),
                    FOREIGN KEY (user_id) REFERENCES users(id),
                    UNIQUE(user_id, habit_name, habit_date)
                );

                -- Goals
                CREATE TABLE IF NOT EXISTS goals (
                    id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id      INTEGER NOT NULL,
                    goal_name    TEXT    NOT NULL,
                    target_value REAL,
                    metric       TEXT,
                    start_date   TEXT,
                    end_date     TEXT,
                    status       TEXT    DEFAULT 'active',
                    created_at   TEXT    DEFAULT (datetime('now')),
                    FOREIGN KEY (user_id) REFERENCES users(id)
                );
            """)

    # ─────────────────────────────────────────────
    # Authentication
    # ─────────────────────────────────────────────
    @staticmethod
    def _hash_password(password: str, salt: str) -> str:
        return hashlib.pbkdf2_hmac(
            "sha256", password.encode(), salt.encode(), 100_000
        ).hex()

    def create_user(self, username: str, email: str, password: str) -> Dict[str, Any]:
        """Register a new user. Returns {'success': bool, 'message': str, 'user_id': int}."""
        salt = secrets.token_hex(16)
        pw_hash = self._hash_password(password, salt)
        try:
            with self._connect() as conn:
                cur = conn.execute(
                    "INSERT INTO users (username, email, password_hash, salt) VALUES (?,?,?,?)",
                    (username, email, pw_hash, salt),
                )
                return {"success": True, "message": "Account created!", "user_id": cur.lastrowid}
        except sqlite3.IntegrityError as e:
            if "username" in str(e):
                return {"success": False, "message": "Username already taken."}
            return {"success": False, "message": "Email already registered."}

    def authenticate_user(self, username: str, password: str) -> Optional[Dict]:
        """Verify credentials. Returns user dict or None."""
        with self._connect() as conn:
            row = conn.execute(
                "SELECT * FROM users WHERE username = ?", (username,)
            ).fetchone()
        if not row:
            return None
        expected = self._hash_password(password, row["salt"])
        if expected != row["password_hash"]:
            return None
        with self._connect() as conn:
            conn.execute(
                "UPDATE users SET last_login=datetime('now') WHERE id=?", (row["id"],)
            )
        return dict(row)

    # ─────────────────────────────────────────────
    # Daily Logs
    # ─────────────────────────────────────────────
    def upsert_daily_log(self, user_id: int, log_data: Dict[str, Any]) -> bool:
        """Insert or update a daily log entry."""
        log_date = log_data.get("log_date", date.today().isoformat())
        cols = [
            "sleep_hours", "mood_score", "study_hours", "exercise_minutes",
            "screen_time_hours", "focus_score", "stress_level",
            "productivity_score", "water_intake_glasses", "caffeine_mg",
            "expenses", "notes",
        ]
        values = [log_data.get(c, 0) for c in cols]
        set_clause = ", ".join(f"{c}=?" for c in cols)
        try:
            with self._connect() as conn:
                conn.execute(
                    f"""INSERT INTO daily_logs (user_id, log_date, {', '.join(cols)})
                        VALUES (?, ?, {', '.join('?' * len(cols))})
                        ON CONFLICT(user_id, log_date) DO UPDATE SET {set_clause}""",
                    [user_id, log_date] + values + values,
                )
            return True
        except Exception as e:
            print(f"[DB] upsert_daily_log error: {e}")
            return False

    def get_daily_logs(self, user_id: int, days: int = 90) -> pd.DataFrame:
        """Return a DataFrame of the last N days of logs for a user."""
        with self._connect() as conn:
            rows = conn.execute(
                """SELECT * FROM daily_logs
                   WHERE user_id = ?
                   ORDER BY log_date DESC
                   LIMIT ?""",
                (user_id, days),
            ).fetchall()
        if not rows:
            return pd.DataFrame()
        df = pd.DataFrame([dict(r) for r in rows])
        df["log_date"] = pd.to_datetime(df["log_date"])
        return df.sort_values("log_date")

    def get_log_for_date(self, user_id: int, log_date: str) -> Optional[Dict]:
        with self._connect() as conn:
            row = conn.execute(
                "SELECT * FROM daily_logs WHERE user_id=? AND log_date=?",
                (user_id, log_date),
            ).fetchone()
        return dict(row) if row else None

    # ─────────────────────────────────────────────
    # Journal Entries
    # ─────────────────────────────────────────────
    def save_journal_entry(self, user_id: int, content: str, analysis: Dict) -> int:
        with self._connect() as conn:
            cur = conn.execute(
                """INSERT INTO journal_entries
                   (user_id, entry_date, content, sentiment_score, sentiment_label,
                    emotional_tone, stress_indicators, word_count)
                   VALUES (?,datetime('now'),?,?,?,?,?,?)""",
                (
                    user_id, content,
                    analysis.get("sentiment_score", 0.0),
                    analysis.get("sentiment_label", "Neutral"),
                    analysis.get("emotional_tone", ""),
                    str(analysis.get("stress_indicators", [])),
                    len(content.split()),
                ),
            )
            return cur.lastrowid

    def get_journal_entries(self, user_id: int, limit: int = 30) -> pd.DataFrame:
        with self._connect() as conn:
            rows = conn.execute(
                """SELECT * FROM journal_entries WHERE user_id=?
                   ORDER BY entry_date DESC LIMIT ?""",
                (user_id, limit),
            ).fetchall()
        if not rows:
            return pd.DataFrame()
        return pd.DataFrame([dict(r) for r in rows])

    # ─────────────────────────────────────────────
    # Predictions
    # ─────────────────────────────────────────────
    def save_prediction(self, user_id: int, model_type: str,
                        value: float, confidence: float, features: Dict = None) -> None:
        with self._connect() as conn:
            conn.execute(
                """INSERT INTO predictions
                   (user_id, prediction_date, model_type, prediction_value, confidence, features_used)
                   VALUES (?,datetime('now'),?,?,?,?)""",
                (user_id, model_type, value, confidence, str(features or {})),
            )

    # ─────────────────────────────────────────────
    # Stats / Aggregates
    # ─────────────────────────────────────────────
    def get_summary_stats(self, user_id: int) -> Dict[str, float]:
        """Return average values across all logs for KPI cards."""
        df = self.get_daily_logs(user_id, days=30)
        if df.empty:
            return {}
        numeric = df.select_dtypes(include="number")
        return numeric.mean().to_dict()

    def get_streak(self, user_id: int) -> int:
        """Return consecutive day logging streak."""
        with self._connect() as conn:
            rows = conn.execute(
                """SELECT DISTINCT log_date FROM daily_logs
                   WHERE user_id=? ORDER BY log_date DESC""",
                (user_id,),
            ).fetchall()
        if not rows:
            return 0
        dates = [datetime.strptime(r["log_date"], "%Y-%m-%d").date()
                 if isinstance(r["log_date"], str) else r["log_date"].date()
                 for r in rows]
        streak = 0
        check = date.today()
        for d in sorted(dates, reverse=True):
            if d == check:
                streak += 1
                check = date(check.year, check.month, check.day - 1) if check.day > 1 else check
            else:
                break
        return streak

    def load_sample_data(self, user_id: int) -> int:
        """Load pre-generated sample data for demo purposes."""
        from data.sample_generator import generate_sample_logs
        records = generate_sample_logs(user_id, days=90)
        count = 0
        for rec in records:
            if self.upsert_daily_log(user_id, rec):
                count += 1
        return count