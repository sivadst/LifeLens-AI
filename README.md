<div align="center">

# 🔮 LifeLens AI

### *Intelligent Life Analytics Platform*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev)
[![Prisma](https://img.shields.io/badge/Prisma-7.0-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io)
[![License](https://img.shields.io/badge/License-MIT-00d4ff?style=for-the-badge)](LICENSE)

**AI-powered health intelligence, nutrition analysis, visual recognition, and wellness tracking — your personal AI copilot for a healthier, smarter life.**

[🚀 Live Demo](#) · [📖 Documentation](#-setup-guide) · [🐛 Report Bug](https://github.com/sivadst/LifeLens-AI/issues) · [✨ Request Feature](https://github.com/sivadst/LifeLens-AI/issues)

---

<img src="https://img.shields.io/badge/build-passing-00ff88?style=flat-square" /> <img src="https://img.shields.io/badge/PRs-welcome-00d4ff?style=flat-square" /> <img src="https://img.shields.io/badge/Made%20with-♥-ff2d78?style=flat-square" />

</div>

---

## 🌟 Overview

**LifeLens AI** is a premium AI-powered ecosystem that combines health intelligence, nutrition analysis, visual recognition, and wellness tracking into a single, beautiful platform. Built with cutting-edge technologies and designed with Apple-level polish.

> _"The future of personal health — powered by AI."_

---

## ✨ Features

### 🍎 AI Food Vision Engine
Upload any food image and get instant AI-powered nutritional analysis:
- **Food identification** with confidence scores
- **Complete macro breakdown** — calories, protein, carbs, fat, fiber, sugar, sodium
- **Micronutrient analysis** — vitamins, minerals, % daily value
- **Health score** (1-10) with detailed reasoning
- **Personalized recommendations** — fitness, diet, gym pairing, meal timing
- Beautiful **pie charts** and **bar charts** for visual breakdown

### 💪 AI Body Analyzer
Comprehensive body health assessment:
- **BMI calculation** with animated gauge visualization
- **Daily calorie recommendation** using Mifflin-St Jeor equation
- **Macro split** (protein/carbs/fat) tailored to activity level
- **Health risk detection** based on BMI, sleep, hydration, activity
- **AI-generated improvement roadmap** with milestone timeline
- Sleep and hydration recommendations

### 🔧 AI Damage Detection
Upload device images for intelligent damage analysis:
- Detects **cracks, dents, scratches, water damage, screen issues**
- **Severity classification** with color-coded badges
- **Repair difficulty** assessment and **cost range** estimates
- **Maintenance advice** and **prevention tips**
- Futuristic **scan line** loading animation

### 🤖 Life AI Assistant
Persistent conversational AI wellness coach:
- **Natural language chat** with streaming responses
- **Voice input** (Web Speech API) and **voice output** (Speech Synthesis)
- **Contextual suggestions** for health, fitness, nutrition, stress
- **Typing animation** and smooth message rendering
- Markdown formatting with bold text support

### 📊 Real-Time Analytics Dashboard
Futuristic data visualization:
- **KPI cards** with animated counters and trend indicators
- **Health trend** area charts (7/30/90 day views)
- **Wellness radar** chart for balance assessment
- **Weekly performance** comparison bars
- **Streak tracking** with visual calendar
- **AI predictions** with dashed trend lines
- **Correlation radar** for health factor analysis

### 🔐 Authentication System
Secure, production-ready auth:
- **Email/password** authentication with bcrypt hashing
- **Google OAuth** integration (optional)
- **JWT sessions** with secure token handling
- **Protected routes** with server-side session validation
- Beautiful animated login/signup pages

### 👤 User Profile
Complete user dashboard:
- **Activity timeline** with icon-coded history
- **Usage statistics** across all AI engines
- **Export reports** (PDF) for nutrition, health, and AI analysis
- **AI insights** summary with improvement trends

---

## 🏗 Architecture

```
lifelens-ai/
├── prisma/
│   └── schema.prisma          # Database schema (User, FoodAnalysis, etc.)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/           # NextAuth + registration endpoints
│   │   │   └── ai/             # Gemini-powered AI endpoints
│   │   │       ├── food-analyze/
│   │   │       ├── body-analyze/
│   │   │       ├── damage-detect/
│   │   │       └── chat/
│   │   ├── dashboard/          # Protected dashboard pages
│   │   │   ├── food-vision/
│   │   │   ├── body-analyzer/
│   │   │   ├── damage-detection/
│   │   │   ├── assistant/
│   │   │   ├── analytics/
│   │   │   └── profile/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── layout.tsx          # Root layout with fonts & providers
│   │   ├── page.tsx            # Smart redirect (auth check)
│   │   └── globals.css         # Premium design system
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── Sidebar.tsx         # Collapsible navigation
│   │   ├── Navbar.tsx          # Top bar with search & user
│   │   ├── DashboardShell.tsx  # Layout wrapper
│   │   └── Providers.tsx       # NextAuth session provider
│   └── lib/
│       ├── auth.ts             # NextAuth configuration
│       ├── prisma.ts           # Prisma client singleton
│       └── gemini.ts           # Gemini API wrapper
├── .env.example
├── vercel.json
├── netlify.toml
└── package.json
```

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16 (App Router, Server Components) |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS 4 + Custom CSS Design System |
| **Animations** | Framer Motion |
| **AI Engine** | Google Gemini 2.0 Flash (Vision + Chat) |
| **Authentication** | NextAuth.js (Credentials + Google OAuth) |
| **Database** | Prisma 7 + SQLite (dev) / PostgreSQL (prod) |
| **Charts** | Recharts (Area, Bar, Radar, Pie, Line, Radial) |
| **Icons** | Lucide React |
| **Fonts** | Inter + JetBrains Mono (Google Fonts) |
| **Image Upload** | React Dropzone |
| **Voice** | Web Speech API + Speech Synthesis |

---

## 🚀 Setup Guide

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/sivadst/LifeLens-AI.git
cd LifeLens-AI

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Initialize the database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXTAUTH_URL` | ✅ | Your app URL (default: `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | ✅ | Random secret for JWT signing |
| `GEMINI_API_KEY` | ⚡ | Google Gemini API key (app works with demo data without it) |
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth client ID (optional) |
| `GOOGLE_CLIENT_SECRET` | ❌ | Google OAuth secret (optional) |
| `DATABASE_URL` | ✅ | Database connection string |

---



## 🎨 Design Philosophy

LifeLens AI follows a **dark futuristic** design language:

- 🌌 **Deep dark backgrounds** with subtle gradient meshes
- 💎 **Glassmorphism** cards with backdrop blur
- ✨ **Neon accents** — cyan, purple, green, orange, pink
- 🌊 **Smooth animations** powered by Framer Motion
- 📐 **Clean typography** with Inter and JetBrains Mono
- 🎯 **Micro-interactions** on every interactive element
- 📱 **Fully responsive** across all screen sizes

---

## 🗺 Roadmap

- [x] AI Food Vision Engine
- [x] AI Body Analyzer
- [x] AI Damage Detection
- [x] AI Chat Assistant with Voice I/O
- [x] Analytics Dashboard with Charts
- [x] Authentication (Email + Google)
- [x] User Profile & Activity Timeline
- [ ] Real-time data sync with cloud database
- [ ] Mobile app (React Native)
- [ ] Wearable device integration
- [ ] Multi-language support
- [ ] Team/family health tracking
- [ ] Integration with Apple Health / Google Fit

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



---

<div align="center">

**Built with ♥ by [sivadst](https://github.com/sivadst)**

*Powered by Next.js, TypeScript, Gemini AI, and modern web technologies.*

⭐ Star this repo if you find it useful!

</div>
