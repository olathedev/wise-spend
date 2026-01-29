import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isCoach = message.role === 'coach';
  
  return (
    <div className={`flex gap-4 max-w-[85%] ${isCoach ? '' : 'ml-auto flex-row-reverse'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
        isCoach ? 'bg-primary text-white dark:bg-primary' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
      }`}>
        <span className="material-symbols-outlined text-xl">
          {isCoach ? 'psychology' : 'person'}
        </span>
      </div>
      <div className={`space-y-2 ${isCoach ? '' : 'text-right'}`}>
        <div className={`p-4 rounded-2xl shadow-sm leading-relaxed text-sm font-medium ${
          isCoach 
            ? 'bg-primary text-white rounded-tl-none dark:bg-primary' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tr-none border border-slate-200/50 dark:border-slate-700/50'
        }`}>
          {message.text}
        </div>
        <span className={`text-[10px] text-slate-400 uppercase font-bold tracking-widest block ${isCoach ? 'ml-1' : 'mr-1'}`}>
          {isCoach ? 'Coach' : 'You'} • {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

const formatTimestamp = (timestamp: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins === 1) return '1 min ago';
  if (diffMins < 60) return `${diffMins} min ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  return 'Earlier today';
};

export default ChatBubble;
