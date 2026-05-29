"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { Send, Bot, User, Sparkles, Mic, MicOff, Volume2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! 🌟 I'm **LifeLens AI**, your personal health and wellness assistant.\n\nI can help you with nutrition, fitness, sleep optimization, stress management, and more. What would you like to explore today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: { results: { transcript: string }[][] }) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  };

  const speak = (text: string) => {
    const clean = text.replace(/\*\*/g, "").replace(/[#*_`]/g, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const formatContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      const boldFormatted = line.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-[var(--color-text-primary)]">$1</strong>'
      );
      if (line.startsWith("- ")) {
        return (
          <div key={i} className="flex items-start gap-2 ml-2">
            <span className="text-[var(--color-accent-cyan)] mt-1">•</span>
            <span dangerouslySetInnerHTML={{ __html: boldFormatted.substring(2) }} />
          </div>
        );
      }
      return line ? (
        <p key={i} dangerouslySetInnerHTML={{ __html: boldFormatted }} />
      ) : (
        <br key={i} />
      );
    });
  };

  const suggestions = [
    "How can I improve my sleep?",
    "Suggest a quick workout routine",
    "Tips for reducing stress",
    "What should I eat post-workout?",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col"
    >
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#6025c0] flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="gradient-text">Life AI Assistant</span>
        </h1>
        <p className="text-[var(--color-text-muted)] mt-1">Your personal AI wellness coach</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-[#7c3aed] to-[#00d4ff]"
                  : "bg-gradient-to-br from-[#00d4ff] to-[#00ff88]"
              }`}
            >
              {msg.role === "assistant" ? (
                <Sparkles className="w-4 h-4 text-white" />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <div
              className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed space-y-1 ${
                msg.role === "assistant"
                  ? "glass text-[var(--color-text-muted)]"
                  : "bg-gradient-to-r from-[rgba(0,212,255,0.15)] to-[rgba(124,58,237,0.1)] border border-white/5 text-[var(--color-text-primary)]"
              }`}
            >
              {formatContent(msg.content)}
              {msg.role === "assistant" && (
                <button
                  onClick={() => speak(msg.content)}
                  className="mt-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent-cyan)] transition-colors"
                  title="Read aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#00d4ff] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="glass p-4 rounded-2xl">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    className="w-2 h-2 rounded-full bg-[var(--color-accent-cyan)]"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setInput(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-[var(--color-text-muted)] hover:border-[var(--color-accent-cyan)] hover:text-[var(--color-accent-cyan)] transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="glass p-3 flex items-center gap-3">
        <button
          onClick={toggleVoice}
          className={`p-2.5 rounded-xl transition-all ${
            isListening
              ? "bg-[rgba(255,45,120,0.15)] text-[var(--color-accent-pink)]"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-accent-cyan)] hover:bg-white/5"
          }`}
          title={isListening ? "Stop listening" : "Voice input"}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask me anything about health & wellness..."
          className="flex-1 bg-transparent outline-none text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white disabled:opacity-30 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
