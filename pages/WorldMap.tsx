
import React from 'react';
import Globe from '../components/Globe';
import { useLanguage } from '../context/LanguageContext';

const WorldMap: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-racing font-black text-white italic tracking-tighter uppercase mb-4">{t.globalPresence}</h1>
        <p className="text-slate-500 font-medium">{t.mapDesc}</p>
      </header>

      <div className="bg-slate-900/30 rounded-[40px] border border-slate-800 p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-600/5 blur-[120px] rounded-full -z-10" />
        <Globe />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-center">
            <p className="text-4xl font-racing font-bold text-white mb-2">14</p>
            <p className="text-xs font-bold text-slate-500 uppercase">{t.countriesRepresented}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-center">
            <p className="text-4xl font-racing font-bold text-white mb-2">24/7</p>
            <p className="text-xs font-bold text-slate-500 uppercase">{t.uptime}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-center">
            <p className="text-4xl font-racing font-bold text-white mb-2">3</p>
            <p className="text-xs font-bold text-slate-500 uppercase">{t.chapters}</p>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
