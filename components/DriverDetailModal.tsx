
import React from 'react';
import { X, Trophy, Shield, MapPin, Hash, Activity, Flag, History, Award, TrendingUp, Star } from 'lucide-react';
import { Driver, Standing } from '../types';
import { MOCK_STANDINGS, MOCK_SERIES, MOCK_RACES } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { formatLocalDateOnly } from '../utils/racingUtils';

interface DriverDetailModalProps {
  driver: Driver;
  onClose: () => void;
}

const DriverDetailModal: React.FC<DriverDetailModalProps> = ({ driver, onClose }) => {
  const { t, language } = useLanguage();

  // Aggregate stats from standings
  const driverStandings = MOCK_STANDINGS.filter(s => s.driverId === driver.id);
  const totalWins = driverStandings.reduce((acc, s) => acc + s.wins, 0);
  const totalPodiums = driverStandings.reduce((acc, s) => acc + s.podiums, 0);
  const totalPoints = driverStandings.reduce((acc, s) => acc + s.points, 0);
  const totalRaces = driverStandings.reduce((acc, s) => acc + s.racesRun, 0);

  // Get recent races for the series this driver participates in
  const userSeriesIds = Array.from(new Set(driverStandings.map(s => s.seriesId)));
  const recentRaces = MOCK_RACES
    .filter(r => userSeriesIds.includes(r.seriesId) && r.winner !== undefined)
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900 w-full max-w-4xl rounded-[40px] border border-slate-800 shadow-[0_0_100px_rgba(220,38,38,0.1)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
        <div className="relative p-8 md:p-12 border-b border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors z-10">
            <X size={24} />
          </button>

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative">
              <img src={driver.avatar} className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] border-4 border-slate-800 object-cover shadow-2xl" alt={driver.name} />
              <div className="absolute -bottom-3 -right-3 bg-white text-slate-950 px-5 py-1.5 rounded-xl shadow-2xl border-4 border-slate-900 flex flex-col items-center">
                 <span className="text-[8px] font-black text-red-600 leading-none mb-0.5 tracking-tighter">CNA NO.</span>
                 <span className="text-3xl font-racing font-black italic leading-none">{driver.cnaDriverNumber || '??'}</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h2 className="text-4xl font-racing font-bold text-white italic tracking-tighter uppercase">{driver.name}</h2>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  driver.status === 'Online' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                  driver.status === 'Racing' ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse' : 
                  'bg-slate-800 text-slate-500'
                }`}>
                  {driver.status}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-400 font-bold mb-8">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
                  <MapPin size={14} className="text-red-500" /> {driver.country}
                </div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
                  <Hash size={14} className="text-slate-600" /> ID: {driver.id}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-1">iRating</p>
                  <p className="text-xl font-racing font-bold text-red-500 italic">{driver.iRating}</p>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-1">License</p>
                  <p className="text-xl font-racing font-bold text-blue-400 italic">{driver.safetyRating.split(' ')[0]}</p>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-1">CNA Pts</p>
                  <p className="text-xl font-racing font-bold text-amber-500 italic">{totalPoints}</p>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Races</p>
                  <p className="text-xl font-racing font-bold text-white italic">{totalRaces}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Career Breakdown */}
            <div className="space-y-6">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic">
                <Award className="text-red-500" size={18} /> {language === 'en' ? 'League Performance' : '联赛表现明细'}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {MOCK_SERIES.map(series => {
                  const s = driverStandings.find(st => st.seriesId === series.id);
                  if (!s) return null;
                  return (
                    <div key={series.id} className="p-5 bg-slate-800/30 rounded-3xl border border-slate-800 flex items-center justify-between group hover:border-red-600/30 transition-all">
                      <div>
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">{series.name}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                             <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Wins</span>
                             <span className="text-lg font-racing font-bold text-white">{s.wins}</span>
                          </div>
                          <div className="w-px h-6 bg-slate-800" />
                          <div className="flex flex-col">
                             <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Podiums</span>
                             <span className="text-lg font-racing font-bold text-white">{s.podiums}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Pts</p>
                        <p className="text-2xl font-racing font-bold text-amber-500 italic">{s.points}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex items-center gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-red-600/10 flex items-center justify-center">
                    <TrendingUp className="text-red-500" size={32} />
                 </div>
                 <div>
                    <h4 className="text-white font-bold text-sm mb-1">{language === 'en' ? 'Consistency Score' : '竞技一致性'}</h4>
                    <p className="text-xs text-slate-500">{language === 'en' ? 'Based on average finishing position and incidents.' : '基于平均完赛顺位及场均事故统计。'}</p>
                 </div>
                 <div className="ml-auto text-center">
                    <span className="text-3xl font-racing font-bold text-white italic">84</span>
                    <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest">PTS</span>
                 </div>
              </div>
            </div>

            {/* Recent Races */}
            <div className="space-y-6">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic">
                <History className="text-red-500" size={18} /> {language === 'en' ? 'CNA Activity History' : 'CNA 近期参赛记录'}
              </h3>
              <div className="space-y-3">
                {recentRaces.length > 0 ? recentRaces.map(race => (
                  <div key={race.id} className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800/50 flex items-center gap-4 group hover:bg-slate-950 transition-colors">
                    <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                      <img src={race.image} className="w-full h-full object-cover opacity-50" alt={race.track} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{formatLocalDateOnly(race.dateTime)}</p>
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-red-500 transition-colors">{race.track}</h4>
                      <p className="text-[9px] text-slate-600 font-bold uppercase">{race.seriesName}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center px-3 border-l border-slate-800">
                       <span className="text-[8px] font-black text-slate-600 uppercase mb-0.5">Finish</span>
                       <span className="text-sm font-racing font-bold text-slate-400 italic">#{Math.floor(Math.random() * 10) + 1}</span>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center opacity-30 border border-dashed border-slate-800 rounded-3xl">
                     <Flag size={32} className="mx-auto mb-3" />
                     <p className="text-[10px] font-black uppercase tracking-widest">No race data found</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailModal;
