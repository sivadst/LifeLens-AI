import { NextResponse } from "next/server";
import { getGeminiChat, isGeminiConfigured } from "@/lib/gemini";

const SYSTEM_PROMPT = `You are LifeLens AI, a premium AI assistant specialized in health, wellness, productivity, and life optimization. You are warm, knowledgeable, motivating, and provide actionable advice.

Your personality:
- Encouraging and supportive, like a personal coach
- Data-driven but empathetic
- Uses occasional emojis for warmth
- Provides specific, actionable advice
- References health science and research when relevant
- Proactive in suggesting improvements

Areas of expertise:
- Nutrition and diet optimization
- Exercise and fitness guidance
- Mental health and stress management
- Sleep optimization
- Productivity and focus techniques
- Device care and technology advice
- General wellness coaching

Keep responses concise but helpful (2-4 paragraphs max). Always be encouraging.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    if (!isGeminiConfigured()) {
      const lastMsg = messages[messages.length - 1]?.content || "";
      const demoResponse = generateDemoResponse(lastMsg);
      return NextResponse.json({ role: "assistant", content: demoResponse });
    }

    const model = getGeminiChat();

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "System instruction: " + SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "I understand. I'm LifeLens AI, your personal health and wellness assistant. How can I help you today? 🌟" }] },
        ...messages.slice(0, -1).map((m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      ],
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const text = result.response.text();

    return NextResponse.json({ role: "assistant", content: text });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({
      role: "assistant",
      content: "I apologize, but I'm experiencing a momentary issue. Please try again in a moment. 🔄",
    });
  }
}

function generateDemoResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes("sleep") || lower.includes("tired")) {
    return "Sleep is the foundation of health! 🌙 Here are some science-backed tips:\n\n**1. Consistent Schedule**: Go to bed and wake up at the same time daily — even weekends. This regulates your circadian rhythm.\n\n**2. 90-Minute Rule**: Sleep in 90-minute cycles. Aim for 5 cycles (7.5 hours) for optimal restoration.\n\n**3. Wind-Down Ritual**: Start dimming lights 1 hour before bed. Blue light blocks melatonin production.\n\nWould you like me to create a personalized sleep optimization plan?";
  }
  if (lower.includes("exercise") || lower.includes("workout") || lower.includes("gym")) {
    return "Great that you're focusing on fitness! 💪 Here's a balanced approach:\n\n**For Beginners**: Start with 3 days/week — mix of strength training (2x) and cardio (1x). Even 20-minute sessions make a huge difference.\n\n**Key Principle**: Progressive overload — gradually increase weight, reps, or duration each week by ~5%.\n\n**Recovery**: Rest days are when muscles actually grow. Aim for 48 hours between training the same muscle group.\n\nWant me to suggest a specific routine based on your goals?";
  }
  if (lower.includes("diet") || lower.includes("eat") || lower.includes("nutrition") || lower.includes("food")) {
    return "Nutrition is 80% of the health equation! 🥗 Let's optimize:\n\n**Protein Priority**: Aim for 1.6-2.2g per kg of body weight if active. It boosts metabolism and preserves muscle.\n\n**The Plate Method**: Half your plate with vegetables, quarter with protein, quarter with complex carbs.\n\n**Hydration**: Drink water 30 minutes before meals — it improves digestion and naturally controls portions.\n\nWould you like me to analyze a specific meal or create a meal plan?";
  }
  if (lower.includes("stress") || lower.includes("anxious") || lower.includes("mental")) {
    return "Mental health matters deeply. Let's address this together. 🧠\n\n**Immediate Relief**: Try the 4-7-8 breathing technique — inhale for 4 seconds, hold for 7, exhale for 8. It activates your parasympathetic nervous system.\n\n**Daily Practice**: Even 10 minutes of mindfulness meditation reduces cortisol by up to 25%.\n\n**Physical Connection**: A 20-minute walk in nature can reduce stress hormones significantly.\n\nYou're taking the right step by reaching out. Would you like to explore more stress management techniques?";
  }

  return "Thanks for reaching out! 🌟 I'm LifeLens AI, your personal wellness companion.\n\nI can help you with:\n- 🍎 **Nutrition** — Meal analysis and diet planning\n- 💪 **Fitness** — Workout routines and exercise guidance\n- 😴 **Sleep** — Optimization and routine building\n- 🧠 **Mental Health** — Stress management and mindfulness\n- 📊 **Health Tracking** — Understanding your metrics\n\nWhat area would you like to explore? I'm here to help you become your best self!";
}
