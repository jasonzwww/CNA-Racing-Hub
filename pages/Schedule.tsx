
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Trophy, ChevronRight, Zap, Flag, Timer, Info, List, LayoutGrid, ChevronLeft } from 'lucide-react';
import { MOCK_RACES, MOCK_SERIES, GT3_R1_RESULT } from '../constants';
import { RaceStatus, SeriesId, Race, IRacingEventResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatLocalFull, formatLocalDateOnly, formatLocalTimeOnly } from '../utils/racingUtils';
import RaceDetailModal from '../components/RaceDetailModal';

const SCHEDULE_STORAGE_KEY = 'cna_managed_schedule';

const Schedule: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeSeries, setActiveSeries] = useState<SeriesId>('GT3_OPEN');
  const [viewMode, setViewMode] = useState<'LIST' | 'CALENDAR'>('LIST');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [localSchedule, setLocalSchedule] = useState<Race[]>([]);
  const [selectedRaceResult, setSelectedRaceResult] = useState<IRacingEventResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (saved) {
      try {
        setLocalSchedule(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const allRaces = useMemo(() => [...localSchedule, ...MOCK_RACES], [localSchedule]);
  const now = new Date().getTime();
  const seriesRaces = allRaces.filter(r => r.seriesId === activeSeries);
  
  // Sorting for List View
  const upcoming = seriesRaces
    .filter(r => new Date(r.dateTime).getTime() > now)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    
  const completed = seriesRaces
    .filter(r => new Date(r.dateTime).getTime() <= now || r.status === RaceStatus.COMPLETED)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const nextRace = upcoming[0];
  const otherUpcoming = upcoming.slice(1);

  // Calendar Helpers
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days: (Date | null)[] = [];
    
    // Fill leading empty days (Sun = 0)
    const firstDay = firstDayOfMonth(year, month);
    for (let i = 0; i < firstDay; i++) days.push(null);
    
    // Fill actual days
    const numDays = daysInMonth(year, month);
    for (let d = 1; d <= numDays; d++) {
      days.push(new Date(year, month, d));
    }
    
    return days;
  }, [currentDate]);

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const getRacesForDate = (date: Date) => {
    return allRaces.filter(r => {
      const d = new Date(r.dateTime);
      return d.getDate() === date.getDate() && 
             d.getMonth() === date.getMonth() && 
             d.getFullYear() === date.getFullYear();
    });
  };

  const handleRaceClick = (race: Race) => {
    if (race.status === RaceStatus.COMPLETED || new Date(race.dateTime).getTime() < now) {
      if (race.id === '26S1-GT3-1') {
        setSelectedRaceResult(GT3_R1_RESULT);
      }
      // For local managed races, we would fetch detailedResult here
    }
  };

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
      {selectedRaceResult && <RaceDetailModal result={selectedRaceResult} onClose={() => setSelectedRaceResult(null)} />}

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-racing font-black text-white italic tracking-tighter uppercase">{t.raceSchedule}</h1>
          <p className="text-slate-500 font-medium">{t.scheduleDesc}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* View Toggle */}
          <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl shadow-inner">
            <button 
              onClick={() => setViewMode('LIST')}
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'LIST' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode('CALENDAR')}
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'CALENDAR' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>

          {/* Series Filter */}
          <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit shrink-0 shadow-2xl">
            {MOCK_SERIES.map(series => (
              <button
                key={series.id}
                onClick={() => setActiveSeries(series.id)}
                className={`px-8 py-2.5 rounded-xl font-racing font-bold text-xs transition-all tracking-widest ${
                  activeSeries === series.id 
                    ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                {series.id === 'GT3_OPEN' ? t.gt3Open : t.rookies}
              </button>
            ))}
          </div>
        </div>
      </header>

      {viewMode === 'LIST' ? (
        <div className="space-y-12">
          {/* List View - Next Race Hero */}
          {nextRace && (
            <section className="relative">
              <div className="flex items-center gap-3 mb-6 px-2">
                <Zap className="text-red-600 fill-red-600" size={20} />
                <h2 className="text-sm font-black text-white uppercase tracking-[0.3em] italic">
                  {language === 'zh' ? '下一场焦点赛事' : 'THE NEXT CHALLENGE'}
                </h2>
              </div>
              
              <div className="relative h-[300px] md:h-[400px] rounded-[40px] overflow-hidden border border-red-600/30 shadow-[0_0_60px_rgba(220,38,38,0.15)] group">
                <img src={nextRace.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                <div className="absolute top-8 left-8">
                   <div className="bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg tracking-widest flex items-center gap-2">
                      <Timer size={14} /> ROUND {nextRace.id.split('-').pop()}
                   </div>
                </div>

                <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest mb-2">
                       <MapPin size={16} /> {nextRace.seriesName}
                    </div>
                    <h3 className="text-4xl md:text-6xl font-racing font-black text-white italic tracking-tighter uppercase leading-tight drop-shadow-2xl">
                      {nextRace.track}
                    </h3>
                    <div className="flex flex-wrap gap-6 mt-6">
                       <div className="flex items-center gap-2 text-white/90 text-sm font-bold bg-slate-950/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                          <CalendarIcon size={18} className="text-red-500" /> {formatLocalDateOnly(nextRace.dateTime)}
                       </div>
                       <div className="flex items-center gap-2 text-white/90 text-sm font-bold bg-slate-950/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                          <Clock size={18} className="text-red-500" /> {formatLocalTimeOnly(nextRace.dateTime)}
                       </div>
                    </div>
                  </div>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-black py-5 px-12 rounded-2xl transform hover:scale-105 transition-all shadow-[0_15px_30px_rgba(220,38,38,0.4)] whitespace-nowrap uppercase tracking-[0.2em] text-xs italic flex items-center gap-2">
                    {t.register} <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* List View - Future Rounds */}
          {otherUpcoming.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-1.5 h-6 bg-slate-700 rounded-full" />
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] italic">
                  {language === 'zh' ? '未来轮次' : 'FUTURE ROUNDS'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherUpcoming.map(race => (
                  <div key={race.id} className="bg-slate-900/50 hover:bg-slate-900 rounded-[32px] border border-slate-800 p-6 transition-all group hover:border-red-600/30">
                    <div className="h-32 rounded-2xl overflow-hidden mb-6 relative">
                      <img src={race.image} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-3 left-3 bg-slate-950/80 px-3 py-1 rounded-lg text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                        RD {race.id.split('-').pop()}
                      </div>
                    </div>
                    <h4 className="text-lg font-racing font-bold text-white mb-2 italic group-hover:text-red-500 transition-colors truncate">{race.track}</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        <CalendarIcon size={14} className="text-red-500" /> {formatLocalFull(race.dateTime)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* List View - Past */}
          {completed.length > 0 && (
            <section className="pt-8 border-t border-slate-900">
              <div className="flex items-center gap-3 mb-8 px-2">
                <Trophy className="text-slate-600" size={20} />
                <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] italic">
                  {language === 'zh' ? '历史战绩' : 'PAST GLORY'}
                </h2>
              </div>
              <div className="bg-slate-900/30 rounded-[32px] border border-slate-800 overflow-hidden backdrop-blur-sm shadow-inner">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/50">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">ROUND</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">TRACK</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">DATE</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">WINNER</th>
                      <th className="px-8 py-5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {completed.map((race) => (
                      <tr 
                        key={race.id} 
                        className="hover:bg-slate-800/20 transition-colors group cursor-pointer"
                        onClick={() => handleRaceClick(race)}
                      >
                        <td className="px-8 py-6">
                          <span className="font-racing font-bold text-slate-500 italic">RD {race.id.split('-').pop()}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="font-bold text-white text-sm italic group-hover:text-red-500 transition-colors">{race.track}</div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-xs font-bold text-slate-400">{formatLocalDateOnly(race.dateTime)}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <Trophy size={14} className="text-amber-500" />
                            <span className="text-sm font-bold text-white">{race.winner || 'Finalizing...'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <ChevronRight size={20} className="text-slate-600 group-hover:text-red-500" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      ) : (
        <section className="space-y-6">
          {/* Calendar View */}
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-6">
                <h2 className="text-2xl font-racing font-bold text-white uppercase italic">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                  <button onClick={() => changeMonth(-1)} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => changeMonth(1)} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>
             </div>
             <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" /> GT3 Open</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" /> Rookies</div>
             </div>
          </div>

          <div className="bg-slate-900 rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-7 border-b border-slate-800">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950/50">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7">
              {calendarDays.map((date, idx) => {
                const races = date ? getRacesForDate(date) : [];
                const isToday = date && date.toDateString() === new Date().toDateString();
                
                return (
                  <div 
                    key={idx} 
                    className={`min-h-[140px] p-4 border-r border-b border-slate-800 transition-colors ${
                      !date ? 'bg-slate-950/20' : isToday ? 'bg-slate-800/20' : 'hover:bg-slate-800/10'
                    }`}
                  >
                    {date && (
                      <div className="flex flex-col h-full">
                        <span className={`text-sm font-bold mb-3 ${isToday ? 'text-red-500' : 'text-slate-500'}`}>
                          {date.getDate()}
                        </span>
                        
                        <div className="space-y-2">
                          {races.map(race => {
                            const isCompleted = race.status === RaceStatus.COMPLETED || new Date(race.dateTime).getTime() < now;
                            return (
                              <button 
                                key={race.id}
                                onClick={() => handleRaceClick(race)}
                                className={`w-full text-left p-2 rounded-lg border text-[9px] font-black uppercase tracking-tight transition-all flex items-center justify-between gap-1 ${
                                  race.seriesId === 'GT3_OPEN' 
                                    ? 'bg-red-600/10 border-red-600/30 text-red-500 hover:bg-red-600/20' 
                                    : 'bg-blue-600/10 border-blue-600/30 text-blue-500 hover:bg-blue-600/20'
                                }`}
                              >
                                <span className="truncate">{race.track.split(' ')[0]}</span>
                                {isCompleted ? <Trophy size={10} className="shrink-0" /> : <Clock size={10} className="shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Schedule;
