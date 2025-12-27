import React, { useState } from 'react';
import { X, Lock, Mail, Loader2, ShieldCheck, Terminal, Cpu, Database, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { login, isAuthenticating, authStep } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="bg-[#0b0f1a] w-full max-w-lg rounded-[32px] border border-slate-800 shadow-[0_0_80px_rgba(0,59,113,0.3)] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* API Header */}
        <div className="bg-[#003B71] p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cpu size={120} className="text-white" />
          </div>
          
          <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
            <X size={24} />
          </button>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center shadow-2xl shrink-0 p-3">
              <img src="https://ir-racing.s3.amazonaws.com/marketing/Logos/iRacing-Logo-Small.png" className="w-full h-auto" alt="iRacing" />
            </div>
            <div>
              <h2 className="text-2xl font-racing font-bold text-white uppercase tracking-tight">{t.loginWithIRacing}</h2>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mt-2">{t.apiNotice}</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-10">
          {!isAuthenticating ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50 mb-6">
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {t.connectRequest}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t.emailAddress}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type="text" 
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-white focus:border-[#003B71] outline-none transition-all placeholder:text-slate-700"
                      placeholder="driver@iracing.com or Member ID"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t.password}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type="password" 
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-white focus:border-[#003B71] outline-none transition-all placeholder:text-slate-700"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 py-5 rounded-2xl text-white font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-3 shadow-xl shadow-red-900/20 transition-all active:scale-[0.98] mt-4"
              >
                {t.signIn}
              </button>

              <div className="flex items-center justify-center gap-2 text-slate-600 pt-2">
                <ShieldCheck size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">TLS 1.3 Secure External SDK Tunnel</span>
              </div>
            </form>
          ) : (
            <div className="py-8 space-y-8 animate-in fade-in zoom-in-95 duration-300">
               <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-[#003B71] animate-spin" />
                    <Terminal className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-racing font-bold text-white uppercase">{t.authenticating}</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">DO NOT DISCONNECT</p>
                  </div>
               </div>

               {/* Connection Log */}
               <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 font-mono text-[11px] space-y-3">
                  <div className="flex items-center gap-3">
                    {authStep >= 1 ? <CheckCircle2 size={14} className="text-green-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />}
                    <span className={authStep >= 1 ? 'text-slate-300' : 'text-slate-600'}>{t.stepDns}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {authStep >= 2 ? <CheckCircle2 size={14} className="text-green-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />}
                    <span className={authStep >= 2 ? 'text-slate-300' : 'text-slate-600'}>{t.stepSsl}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {authStep >= 3 ? <CheckCircle2 size={14} className="text-green-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />}
                    <span className={authStep >= 3 ? 'text-slate-300' : 'text-slate-600'}>{t.stepAuth}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {authStep >= 4 ? <CheckCircle2 size={14} className="text-green-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />}
                    <span className={authStep >= 4 ? 'text-slate-300' : 'text-slate-600'}>{t.stepSync}</span>
                  </div>
               </div>

               <div className="flex items-center justify-center gap-3 text-slate-600">
                  <Database size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Bridging Member Services...</span>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
