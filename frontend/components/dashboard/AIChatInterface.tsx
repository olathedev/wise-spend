"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { chatWithFinancialAssistant, ChatMessage } from "@/services/aiService";

interface AIChatInterfaceProps {
  initialMessage?: string;
  className?: string;
}

export default function AIChatInterface({
  initialMessage,
  className,
}: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        initialMessage ||
        "Hi! I'm Wise Coach, your personalized financial assistant. I have access to your spending history, goals, and financial data. Ask me anything about your finances - like 'How much did I spend this month?' or 'What's my Wise Score?' - and I'll give you personalized, data-driven insights!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) {
      console.log("HandleSend blocked:", { input: input.trim(), isLoading });
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
    };

    console.log("Sending message:", userMessage);
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      console.log("Calling chatWithFinancialAssistant with messages:", [...messages, userMessage]);
      const response = await chatWithFinancialAssistant({
        messages: [...messages, userMessage],
        temperature: 0.7,
        maxTokens: 1024,
      });

      console.log("Received response:", response);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.content,
        },
      ]);
    } catch (error) {
      console.error("Error chatting with Financial Assistant:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "I'm sorry, I encountered an error. Please try again in a moment.";
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage.includes("Unauthorized") || errorMessage.includes("401")
            ? "Please make sure you're logged in to use the Financial Assistant."
            : errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      console.log("Enter key pressed, calling handleSend");
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-slate-900 ${className}`}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-teal-600" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-teal-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
                <User size={16} className="text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-teal-600" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3">
              <Loader2 size={16} className="text-teal-600 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your spending, goals, Wise Score..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("Send button clicked");
              handleSend();
            }}
            disabled={!input.trim() || isLoading}
            className="px-4 sm:px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Send size={18} />
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          AI responses are for educational purposes only.
        </p>
      </div>
    </div>
  );
}
