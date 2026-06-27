import { useState, useEffect, useRef } from "react";
import { Bot, X, Send, Sparkles, User, MessageSquare } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { db } from "@/lib/db";
import toast from "react-hot-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Aveny, your AI solutions assistant. Ask me anything about Avenix Solutions - our custom web builds, services, pricing, or portfolio! If you want to work with us, just let me know and I can submit your inquiry to our team directly."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const company = db.getCompany();

  useEffect(() => {
    // Scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setHasNewMessage(true);
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await apiFetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setMessages(prev => [...prev, { role: "assistant", content: data.text }]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an issue. Please try again or WhatsApp us directly!"
          }
        ]);
      }
    } catch (err) {
      console.error("Chatbot send error:", err);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Connection failed. Please check your internet and try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Robot Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setHasNewMessage(false);
          }}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#23443d] text-white shadow-xl hover:scale-110 transition-transform duration-300 border-2 border-[#e7b464] animate-pulse"
          title="Chat with Aveny AI"
        >
          {/* Glowing indicator */}
          {hasNewMessage && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold items-center justify-center text-white">1</span>
            </span>
          )}
          <Bot className="h-6 w-6 text-[#e7b464] group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Floating Bubble Tooltip */}
          <span className="absolute right-16 scale-0 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-all duration-300 group-hover:scale-100 whitespace-nowrap">
            Chat with Aveny AI ✨
          </span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="flex h-[520px] w-[90vw] sm:w-[380px] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-6">
          
          {/* Header */}
          <div className="flex items-center justify-between bg-[#23443d] px-4 py-3.5 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
                <Bot className="h-5 w-5 text-[#e7b464]" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight flex items-center gap-1.5">
                  Aveny AI
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                </h3>
                <p className="text-[10px] text-stone-300 font-medium">Growth Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-stone-300 hover:bg-white/10 hover:text-white transition"
              title="Close chat"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto bg-stone-50/50 p-4 space-y-4">
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              return (
                <div key={idx} className={`flex items-start gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (
                    <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-[#23443d] text-white">
                      <Bot className="h-4 w-4 text-[#e7b464]" />
                    </div>
                  )}
                  <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                    isUser 
                      ? "bg-[#23443d] text-white rounded-tr-none font-medium" 
                      : "bg-white border border-stone-200/80 text-stone-850 rounded-tl-none leading-relaxed"
                  }`}>
                    {msg.content}
                  </div>
                  {isUser && (
                    <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-[#e7b464] text-stone-950">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-[#23443d] text-white">
                  <Bot className="h-4 w-4 text-[#e7b464]" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-white border border-stone-200/80 px-4 py-3 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="border-t border-stone-100 p-3 bg-white flex gap-2">
            <input
              type="text"
              required
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about website plans, portfolio..."
              className="flex-1 rounded-xl border border-stone-200 px-3.5 py-2 text-sm outline-none transition focus:border-[#23443d]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#23443d] text-white transition hover:bg-[#1a332e] disabled:bg-stone-200 disabled:text-stone-400"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
