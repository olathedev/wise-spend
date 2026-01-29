'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { streamCoaching } from '../transactions/services/geminiService';
import ChatBubble from './ChatBubble';

const ChatArea: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'coach',
      text: "Hello Daniel. I noticed you've been frequenting local cafes more often lately. Is that $6.50 latte worth 15 minutes of your future retirement?",
      timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      id: '2',
      role: 'user',
      text: "It's a daily ritual. I didn't think it mattered that much in the long run.",
      timestamp: new Date(Date.now() - 180000) // 3 minutes ago
    },
    {
      id: '3',
      role: 'coach',
      text: "Daily rituals provide comfort, but let's look at the math. If we redirected those funds to your 'Home Downpayment' goal, you'd reach it 2 months earlier. Does the immediate comfort of the ritual outweigh the long-term freedom of homeownership for you?",
      timestamp: new Date(Date.now() - 60000) // 1 minute ago
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    const coachId = (Date.now() + 1).toString();
    let fullText = '';
    
    const coachMsg: Message = {
      id: coachId,
      role: 'coach',
      text: '',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, coachMsg]);

    try {
      const stream = streamCoaching(messages, currentInput);
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => 
          prev.map(m => m.id === coachId ? { ...m, text: fullText } : m)
        );
      }
    } catch (error) {
      console.error('Coaching failed', error);
      setMessages(prev => 
        prev.map(m => m.id === coachId ? { ...m, text: 'Sorry, I encountered an error. Please try again.' } : m)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-card-light dark:bg-card-dark rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth"
      >
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isLoading && messages[messages.length - 1]?.text === '' && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center animate-pulse shrink-0">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none text-slate-400 dark:text-slate-500 text-sm">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="relative flex items-center">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 pl-6 pr-24 text-sm focus:ring-2 focus:ring-primary/20 placeholder-slate-400 text-slate-900 dark:text-white"
            placeholder="Type your response..."
            type="text"
            disabled={isLoading}
          />
          <div className="absolute right-2 flex gap-1">
            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">mic</span>
            </button>
            <button 
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className={`bg-primary text-white p-2 rounded-lg shadow-lg shadow-teal-500/30 hover:bg-teal-600 transition-colors ${
                isLoading || !inputValue.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
