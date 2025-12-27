
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, ShieldAlert, Loader2, User, Bot, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { GoogleGenAI } from '@google/genai';

const AISteward: React.FC = () => {
  const { t, language } = useLanguage();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: language === 'zh' 
        ? "你好！我是 CNA Racing AI 赛控干事。你可以向我咨询关于 iRacing 规则、比赛事件分析或我们的联赛规章。" 
        : "Hello! I am the CNA Racing AI Steward. You can ask me about iRacing rules, race incident analysis, or our league regulations."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Re-initializing right before call as per guidelines to avoid stale keys
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...messages, { role: 'user', text: userMessage }].map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: `You are the Official AI Steward for CNA Racing, an elite iRacing community. 
          Your goal is to provide expert advice on racing rules (Sporting Code), analyze hypothetical incidents, 
          and answer questions about CNA Racing league management. 
          Be professional, firm but fair, and helpful. Use markdown for formatting. 
          Current language is ${language === 'zh' ? 'Chinese' : 'English'}.`,
        }
      });

      const aiText = response.text || (language === 'zh' ? "抱歉，我现在无法回答。" : "I'm sorry, I cannot answer right now.");
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error('Gemini Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: language === 'zh' ? "发生错误，请稍后再试。" : "An error occurred. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center gap-4 px-2">
        <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-900/20">
          <MessageSquare size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-racing font-black text-white italic tracking-tighter uppercase leading-none">{t.aiSteward}</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Intelligent Race Direction & Regulation Assistant</p>
        </div>
      </header>

      <div className="bg-slate-900/50 rounded-[40px] border border-slate-800 flex-1 flex flex-col overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 bg-grid-slate-800/[0.05] -z-10" />
        
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-thin">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 md:gap-6 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                m.role === 'user' ? 'bg-slate-800 text-white' : 'bg-red-600 text-white'
              }`}>
                {m.role === 'user' ? <User size={20} /> : <Bot size={24} />}
              </div>
              <div className={`max-w-[85%] md:max-w-[70%] space-y-2 ${m.role === 'user' ? 'text-right' : ''}`}>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {m.role === 'user' ? (language === 'zh' ? '车手' : 'DRIVER') : (language === 'zh' ? '赛会干事' : 'STEWARD')}
                </p>
                <div className={`p-5 rounded-3xl text-sm md:text-base leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-slate-800 text-slate-200 rounded-tr-none border border-slate-700' 
                    : 'bg-slate-950 text-slate-300 rounded-tl-none border border-slate-800 shadow-inner'
                }`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 md:gap-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot size={24} />
              </div>
              <div className="p-5 bg-slate-950 rounded-3xl rounded-tl-none border border-slate-800 flex items-center gap-3">
                <Loader2 size={18} className="animate-spin text-red-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{language === 'zh' ? '正在审理中...' : 'DELIBERATING...'}</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="p-6 md:p-10 bg-slate-950/50 border-t border-slate-800">
          <form onSubmit={handleSendMessage} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Sparkles className="text-slate-600 group-focus-within:text-red-500 transition-colors" size={20} />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'zh' ? "描述事故情况或咨询规则..." : "Describe an incident or ask about rules..."}
              className="w-full bg-slate-950 border border-slate-800 rounded-[24px] py-5 pl-14 pr-32 text-white focus:outline-none focus:border-red-600/50 focus:ring-4 focus:ring-red-600/5 transition-all shadow-xl"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-900/20"
            >
              <Send size={16} />
              <span className="hidden sm:inline uppercase text-[10px] tracking-widest">{language === 'zh' ? '发送' : 'SEND'}</span>
            </button>
          </form>
          <div className="mt-4 flex items-center gap-4 justify-center">
            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
              <ShieldAlert size={12} className="text-amber-500" /> iRacing Sporting Code 2025 Compliant
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-800" />
            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
              <Bot size={12} className="text-red-500" /> Gemini Pro Powered
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISteward;
