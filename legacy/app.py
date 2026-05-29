"""
LifeLens AI - Advanced Personal Analytics & Future Prediction Platform
Main Application Entry Point
"""

import streamlit as st
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import AppConfig
from backend.database import DatabaseManager
from frontend.pages.auth import render_auth_page
from frontend.pages.dashboard import render_dashboard
from frontend.pages.analytics import render_analytics
from frontend.pages.journal import render_journal
from frontend.pages.predictions import render_predictions
from frontend.pages.reports import render_reports
from frontend.pages.data_entry import render_data_entry
from frontend.components.sidebar import render_sidebar

# ─────────────────────────────────────────────
# Page Configuration
# ─────────────────────────────────────────────
st.set_page_config(
    page_title="LifeLens AI",
    page_icon="🔮",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        "Get Help": "https://github.com/lifelens-ai",
        "About": "LifeLens AI — Your Personal Intelligence Platform",
    },
)

# ─────────────────────────────────────────────
# Load Global CSS
# ─────────────────────────────────────────────
def load_css():
    css_path = os.path.join(os.path.dirname(__file__), "frontend", "styles", "custom.css")
    if os.path.exists(css_path):
        with open(css_path, "r") as f:
            st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

load_css()

# ─────────────────────────────────────────────
# Initialize Database
# ─────────────────────────────────────────────
@st.cache_resource
def init_database():
    db = DatabaseManager(AppConfig.DATABASE_URL)
    db.initialize_tables()
    return db

db = init_database()

# ─────────────────────────────────────────────
# Session State Initialization
# ─────────────────────────────────────────────
def init_session_state():
    defaults = {
        "authenticated": False,
        "user_id": None,
        "username": None,
        "current_page": "Dashboard",
        "theme": "dark",
    }
    for key, value in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = value

init_session_state()

# ─────────────────────────────────────────────
# Routing
# ─────────────────────────────────────────────
def main():
    if not st.session_state.authenticated:
        render_auth_page(db)
        return

    # Render sidebar and get selected page
    selected_page = render_sidebar()
    st.session_state.current_page = selected_page

    # Page routing
    page_map = {
        "Dashboard":    render_dashboard,
        "Log Data":     render_data_entry,
        "Analytics":    render_analytics,
        "AI Journal":   render_journal,
        "Predictions":  render_predictions,
        "Reports":      render_reports,
    }

    renderer = page_map.get(selected_page, render_dashboard)
    renderer(db, st.session_state.user_id)

if __name__ == "__main__":
    main()