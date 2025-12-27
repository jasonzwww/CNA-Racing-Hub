
import React, { useEffect, useState } from 'react';
import { Trophy, Timer, TrendingUp, Users, Calendar, MapPin } from 'lucide-react';
import { MOCK_RACES, MOCK_SERIES } from '../constants';
import { RaceStatus, Race, SeriesId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { formatLocalDateOnly } from '../utils/racingUtils';

const SCHEDULE_STORAGE_KEY = 'cna_managed_schedule';

interface TimeLeft {
  d: number;
  h: number;
  m: number;
  s: number;
}

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { visibleDrivers } = useAuth();
  const [localSchedule, setLocalSchedule] = useState<Race[]>([]);
  const [timers, setTimers] = useState<Record<string, TimeLeft | null>>({});

  useEffect(() => {
    const saved = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (saved) {
      try {
        setLocalSchedule(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const getNextRaceForSeries = (seriesId: SeriesId) => {
    const allRaces = [...localSchedule, ...MOCK_RACES];
    return allRaces
      .filter(r => r.seriesId === seriesId && r.status === RaceStatus.UPCOMING)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0];
  };

  useEffect(() => {
    const updateTimers = () => {
      const newTimers: Record<string, TimeLeft | null> = {};
      
      MOCK_SERIES.forEach(series => {
        const race = getNextRaceForSeries(series.id);
        if (!race) {
          newTimers[series.id] = null;
          return;
        }

        const target = new Date(race.dateTime).getTime();
        const now = new Date().getTime();
        const diff = target - now;

        if (diff <= 0) {
          newTimers[series.id] = null;
        } else {
          newTimers[series.id] = {
            d: Math.floor(diff / (1000 * 60 * 60 * 24)),
            h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            s: Math.floor((diff % (1000 * 60)) / 1000)
          };
        }
      });
      
      setTimers(newTimers);
    };

    const interval = setInterval(updateTimers, 1000);
    updateTimers();

    return () => clearInterval(interval);
  }, [localSchedule]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="relative h-64 md:h-80 rounded-[40px] overflow-hidden shadow-2xl group border border-slate-800">
        <img 
            src="https://images.unsplash.com/photo-1552066344-24632e2221bc?q=80&w=1200&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" 
            alt="Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-racing font-black text-white italic tracking-tighter mb-2 uppercase">{t.pushLimits}</h2>
                <p className="text-slate-300 font-medium text-sm md:text-base leading-relaxed">{t.heroDesc}</p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white font-black py-4 px-10 rounded-2xl transform hover:scale-105 transition-all shadow-[0_15px_30px_rgba(220,38,38,0.3)] whitespace-nowrap uppercase tracking-widest text-xs italic">
                {t.joinLeague}
            </button>
        </div>
      </header>

      <section>
        <div className="flex items-center gap-3 mb-6 px-2">
          <Timer className="text-red-500" size={24} />
          <h3 className="text-xl font-racing font-bold text-white uppercase tracking-tight italic">{t.nextEvent}</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MOCK_SERIES.map(series => {
            const nextRace = getNextRaceForSeries(series.id);
            const timeLeft = timers[series.id];

            return (
              <div key={series.id} className="bg-slate-900 rounded-[32px] p-8 border border-slate-800 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Timer size={100} className="text-red-500" />
                </div>
                
                {nextRace && timeLeft ? (
                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest mb-3 ${
                          series.id === 'GT3_OPEN' ? 'bg-red-600/20 text-red-500' : 'bg-blue-600/20 text-blue-400'
                        }`}>
                          {series.id === 'GT3_OPEN' ? t.gt3Open : t.rookies}
                        </span>
                        <h4 className="text-2xl font-racing font-bold text-white flex items-center gap-2 italic">
                           <MapPin size={18} className="text-slate-500" /> {nextRace.track}
                        </h4>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">LOCAL START</p>
                        <p className="text-sm font-black text-slate-300 uppercase italic">{formatLocalDateOnly(nextRace.dateTime)}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 sm:gap-6">
                      {[
                        { label: 'D', val: timeLeft.d },
                        { label: 'H', val: timeLeft.h },
                        { label: 'M', val: timeLeft.m },
                        { label: 'S', val: timeLeft.s },
                      ].map((tUnit) => (
                        <div key={tUnit.label} className="flex flex-col items-center">
                          <div className="bg-slate-950 w-14 sm:w-20 h-16 sm:h-24 rounded-2xl flex items-center justify-center border border-slate-800 shadow-inner group-hover:border-red-600/50 transition-colors">
                            <span className="text-2xl sm:text-4xl font-racing font-bold text-white italic">{String(tUnit.val).padStart(2, '0')}</span>
                          </div>
                          <span className="mt-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">{tUnit.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-44 flex flex-col items-center justify-center text-center">
                    <Calendar className="text-slate-800 mb-3" size={40} />
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No upcoming {series.name} races</p>
                    <p className="text-[10px] text-slate-600 mt-1 uppercase">Stay tuned for the new schedule</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center gap-6 group hover:border-blue-500/50 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Users className="text-blue-500" size={28} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.totalDrivers}</p>
                <p className="text-3xl font-racing font-bold text-white italic">{visibleDrivers.length}</p>
            </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center gap-6 group hover:border-amber-500/50 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                <Trophy className="text-amber-500" size={28} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.seasonRaces}</p>
                <p className="text-3xl font-racing font-bold text-white italic">42</p>
            </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center gap-6 group hover:border-emerald-500/50 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <TrendingUp className="text-emerald-500" size={28} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.avgStrength}</p>
                <p className="text-3xl font-racing font-bold text-white italic">3.8k iR</p>
            </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-xl font-racing font-bold text-white flex items-center gap-3 uppercase italic">
                <TrendingUp className="text-red-500" /> {t.recentResults}
            </h3>
            <button className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]">{t.viewAll}</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_RACES.filter(r => r.status === RaceStatus.COMPLETED).slice(0, 3).map(race => {
                const winnerName = race.winner || 'TBD';
                
                return (
                <div key={race.id} className="bg-slate-900 rounded-[28px] border border-slate-800 overflow-hidden group hover:border-red-600/50 transition-all shadow-xl">
                    <div className="h-32 overflow-hidden relative">
                        <img src={race.image} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-sm rounded-lg text-[10px] font-black text-red-500 uppercase tracking-widest border border-slate-800">
                            {race.seriesName}
                        </div>
                    </div>
                    <div className="p-5">
                        <h4 className="font-racing font-bold text-white italic truncate mb-2">{race.track}</h4>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <Trophy size={14} className="text-amber-500" />
                            <span>{t.winner}: <span className="text-white">{winnerName}</span></span>
                        </div>
                    </div>
                </div>
            )})}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
