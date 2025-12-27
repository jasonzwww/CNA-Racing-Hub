
import React, { useState } from 'react';
import { Trophy, Medal, Star, ChevronRight } from 'lucide-react';
import { MOCK_STANDINGS, MOCK_SERIES } from '../constants';
import { SeriesId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Standings: React.FC = () => {
  const { t } = useLanguage();
  const { allDrivers } = useAuth();
  const [activeSeries, setActiveSeries] = useState<SeriesId>('GT3_OPEN');

  const filteredStandings = MOCK_STANDINGS
    .filter(s => s.seriesId === activeSeries)
    .sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-racing font-black text-white italic tracking-tighter uppercase">{t.standings}</h1>
        <p className="text-slate-500 font-medium">Seasonal championship leaderboards.</p>
      </header>

      {/* Series Filter Tabs */}
      <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        {MOCK_SERIES.map(series => (
          <button
            key={series.id}
            onClick={() => setActiveSeries(series.id)}
            className={`px-8 py-2.5 rounded-xl font-racing font-bold text-sm transition-all ${
              activeSeries === series.id 
                ? 'bg-red-600 text-white shadow-lg' 
                : 'text-slate-500 hover:text-white'
            }`}
          >
            {series.id === 'GT3_OPEN' ? t.gt3Open : t.rookies}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase w-20">{t.rank}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Driver</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">{t.wins}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">{t.podiums}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">{t.races}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">{t.points}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredStandings.map((standing, index) => {
                const driver = allDrivers.find(d => d.id === standing.driverId);
                const rank = index + 1;
                
                const displayName = driver ? driver.name : `League Member #${standing.driverId.slice(-4)}`;
                const displayAvatar = driver ? driver.avatar : 'https://i.pravatar.cc/150?u=member';

                return (
                  <tr key={standing.driverId} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-racing font-bold ${
                        rank === 1 ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]' :
                        rank === 2 ? 'bg-slate-300 text-slate-950' :
                        rank === 3 ? 'bg-orange-700 text-white' :
                        'text-slate-500'
                      }`}>
                        {rank}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={displayAvatar} className="w-10 h-10 rounded-lg border border-slate-800" alt="Avatar" />
                        <div>
                          <div className="font-bold text-white group-hover:text-red-500 transition-colors">{displayName}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-widest">{driver?.country || 'CNA Member'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-300 font-medium">{standing.wins}</td>
                    <td className="px-6 py-4 text-center text-slate-300 font-medium">{standing.podiums}</td>
                    <td className="px-6 py-4 text-center text-slate-400 text-sm">{standing.racesRun}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xl font-racing font-bold text-white">{standing.points}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Season Progress Note */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center shrink-0">
          <Star className="text-red-600" size={24} />
        </div>
        <div>
          <h4 className="font-bold text-white">Season 26S1 Progress</h4>
          <p className="text-sm text-slate-500">Points are updated after every race weekend. Elite competition is live.</p>
        </div>
        <button className="ml-auto flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white uppercase transition-colors">
          View Scoring Rules <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Standings;
