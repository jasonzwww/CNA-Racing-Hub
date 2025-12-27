
import React, { useState, useEffect } from 'react';
import { History, Trophy, ChevronRight, X, Info, Timer, Zap } from 'lucide-react';
import { MOCK_SEASONS, MOCK_STANDINGS, MOCK_SERIES, MOCK_RACES, GT3_R1_RESULT } from '../constants';
import { Season, Driver, Race, IRacingEventResult, SeriesId, LocalManagedRace, RaceStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { formatInterval, getCarBrandLogo } from '../utils/racingUtils';
import RaceDetailModal from '../components/RaceDetailModal';

const STORAGE_KEY = 'cna_managed_races';

const SeasonCard: React.FC<{ season: Season, onClick: () => void, language: string, drivers: Driver[] }> = ({ season, onClick, language, drivers }) => {
  const { t } = useLanguage();
  const isActive = season.status === 'ACTIVE';

  const getChampion = (seriesId: string) => {
    const standings = MOCK_STANDINGS
      .filter(s => s.seasonId === season.id && s.seriesId === seriesId)
      .sort((a, b) => b.points - a.points);
    return standings.length > 0 ? standings[0] : null;
  };

  const getDriver = (id: string): Driver | undefined => drivers.find(d => d.id === id);

  return (
    <div 
      onClick={onClick}
      className={`bg-slate-900 rounded-3xl border ${isActive ? 'border-red-600/50 shadow-[0_0_40px_rgba(220,38,38,0.1)]' : 'border-slate-800'} p-8 cursor-pointer hover:bg-slate-800/50 transition-all group flex flex-col shadow-lg relative overflow-hidden`}
    >
      {isActive && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-red-600 rounded-full shadow-lg z-10 animate-pulse">
            <Zap size={10} className="fill-white" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{language === 'en' ? 'LIVE' : '进行中'}</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className={`w-12 h-12 rounded-2xl ${isActive ? 'bg-red-600 shadow-red-900/40' : 'bg-slate-800'} flex items-center justify-center transition-colors shadow-inner`}>
          {isActive ? <Timer size={24} className="text-white" /> : <Trophy size={24} className="text-white" />}
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{season.year}</span>
      </div>
      
      <h3 className="text-xl font-racing font-black italic tracking-tighter uppercase text-white mb-2 leading-tight">{season.name}</h3>
      <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-6">{season.id} - {isActive ? (language === 'en' ? 'Ongoing' : '赛季进行中') : (language === 'en' ? 'Archived' : '往届存档')}</p>
      
      <div className="space-y-3 mb-8 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/50">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
            {isActive ? (language === 'en' ? 'Current Leaders' : '当前积分榜首') : (language === 'en' ? 'Season Champions' : '赛季冠军')}
        </p>
        {MOCK_SERIES.map(series => {
          const champ = getChampion(series.id);
          const driver = champ ? getDriver(champ.driverId) : null;
          const champName = driver ? driver.name : (champ ? 'League Member' : 'N/A');
          
          return (
            <div key={series.id} className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{series.id === 'GT3_OPEN' ? t.gt3Open : t.rookies}</span>
              <div className="flex items-center gap-2">
                {isActive ? <Zap size={10} className="text-red-500" /> : <Trophy size={10} className="text-amber-500" />}
                <span className="text-xs font-bold text-white truncate max-w-[100px]">{champName}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs font-black text-red-500 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
        {isActive ? (language === 'en' ? 'Track Progress' : '追踪进度') : t.viewArchive} <ChevronRight size={14} />
      </div>
    </div>
  );
};

const Archives: React.FC = () => {
  const { t, language } = useLanguage();
  const { visibleDrivers } = useAuth();
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [activeTab, setActiveTab] = useState<'HOF' | 'RACES'>('HOF');
  const [activeSeries, setActiveSeries] = useState<SeriesId>('GT3_OPEN');
  const [detailedRace, setDetailedRace] = useState<IRacingEventResult | null>(null);
  const [localRaces, setLocalRaces] = useState<LocalManagedRace[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLocalRaces(JSON.parse(saved));
      } catch (e) { console.error(e); }
    }
  }, [selectedSeason, activeTab]);

  const activeSeasons = MOCK_SEASONS.filter(s => s.status === 'ACTIVE');
  const archivedSeasons = MOCK_SEASONS.filter(s => s.status === 'ARCHIVED');

  const getTopThree = (seasonId: string, seriesId: string) => {
    return MOCK_STANDINGS
      .filter(s => s.seasonId === seasonId && s.seriesId === seriesId)
      .sort((a, b) => b.points - a.points)
      .slice(0, 3);
  };

  const getDriver = (id: string): Driver | undefined => visibleDrivers.find(d => d.id === id);

  const getVisibleRaces = (): (Race | LocalManagedRace)[] => {
    if (!selectedSeason) return [];
    const mockFiltered = MOCK_RACES.filter(r => r.seasonId === selectedSeason.id && r.seriesId === activeSeries && r.status === RaceStatus.COMPLETED);
    const localFiltered = localRaces.filter(r => r.seasonId === selectedSeason.id && r.seriesId === activeSeries);
    return [...localFiltered, ...mockFiltered].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {detailedRace && <RaceDetailModal result={detailedRace} onClose={() => setDetailedRace(null)} />}

      <header>
        <h1 className="text-3xl font-racing font-black text-white italic tracking-tighter uppercase">{t.archives}</h1>
        <p className="text-slate-500 font-medium">{language === 'en' ? 'Manage current progress and revisit historical glory.' : '管理当前赛季进度，重温历史荣耀时刻。'}</p>
      </header>

      {selectedSeason ? (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <button 
              onClick={() => setSelectedSeason(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest w-fit"
            >
              <ChevronRight className="rotate-180" size={18} /> {language === 'en' ? 'Back to Seasons' : '返回赛季列表'}
            </button>
            
            <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button 
                onClick={() => setActiveTab('HOF')}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'HOF' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500'}`}
              >
                {selectedSeason.status === 'ACTIVE' ? (language === 'en' ? 'Standings' : '积分榜') : (language === 'en' ? 'Hall of Fame' : '名人堂')}
              </button>
              <button 
                onClick={() => setActiveTab('RACES')}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'RACES' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500'}`}
              >
                {language === 'en' ? 'Race Events' : '比赛结果'}
              </button>
            </div>
          </div>

          {activeTab === 'HOF' ? (
            <div className={`bg-slate-900 border ${selectedSeason.status === 'ACTIVE' ? 'border-red-600/30' : 'border-slate-800'} rounded-3xl p-8 shadow-2xl relative overflow-hidden`}>
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  {selectedSeason.status === 'ACTIVE' ? <Zap size={120} className="text-red-500" /> : <History size={120} className="text-red-500" />}
              </div>
              
              <div className="relative z-10">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                    {selectedSeason.year} {selectedSeason.status === 'ACTIVE' ? (language === 'en' ? 'Ongoing Battle' : '正在激战') : (language === 'en' ? 'Hall of Fame' : '名人堂')}
                </span>
                <h2 className="text-4xl font-racing font-bold text-white mb-8 italic">{selectedSeason.name}</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {MOCK_SERIES.map(series => {
                    const topThree = getTopThree(selectedSeason.id, series.id);
                    return (
                      <div key={series.id} className="space-y-6">
                        <div className="flex items-center gap-3">
                          <Trophy className={selectedSeason.status === 'ACTIVE' ? "text-red-500" : "text-amber-500"} size={20} />
                          <h3 className="text-xl font-racing font-bold text-white uppercase">{series.name}</h3>
                        </div>
                        
                        <div className="space-y-4">
                          {topThree.map((standing, index) => {
                            const driver = getDriver(standing.driverId);
                            const rank = index + 1;
                            const driverName = driver ? driver.name : 'League Member';
                            const avatar = driver ? driver.avatar : 'https://i.pravatar.cc/150?u=member';
                            
                            return (
                              <div key={standing.driverId} className="flex items-center gap-4 p-4 bg-slate-950/40 rounded-2xl border border-slate-800/50">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-racing font-bold ${
                                  rank === 1 ? 'bg-amber-500 text-slate-950' :
                                  rank === 2 ? 'bg-slate-300 text-slate-950' :
                                  'bg-orange-700 text-white'
                                }`}>
                                  {rank}
                                </div>
                                <img src={avatar} className="w-12 h-12 rounded-xl border border-slate-800" alt="Driver" />
                                <div className="flex-1">
                                  <p className="font-bold text-white">{driverName}</p>
                                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">{driver?.country || 'Confidential'}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-racing font-bold text-white">{standing.points}</p>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase">PTS</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              {/* 系列赛筛选 */}
              <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
                {MOCK_SERIES.map(series => (
                  <button
                    key={series.id}
                    onClick={() => setActiveSeries(series.id)}
                    className={`px-8 py-2.5 rounded-xl font-racing font-bold text-xs transition-all ${
                      activeSeries === series.id 
                        ? 'bg-red-600 text-white shadow-lg' 
                        : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    {series.id === 'GT3_OPEN' ? t.gt3Open : t.rookies}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {getVisibleRaces().map((race) => {
                  const isGT3R1 = race.id === '26S1-GT3-1';
                  const resultToShow = isGT3R1 ? GT3_R1_RESULT : ((race as LocalManagedRace).detailedResult || null);
                  const raceSession = resultToShow ? resultToShow.session_results[0].results : [];

                  return (
                    <div 
                      key={race.id} 
                      onClick={() => resultToShow && setDetailedRace(resultToShow)}
                      className={`bg-slate-900 rounded-[32px] border border-slate-800 p-8 transition-all relative overflow-hidden shadow-xl ${resultToShow ? 'hover:border-red-600/50 cursor-pointer group' : 'opacity-80 cursor-default'}`}
                    >
                      <div className="flex flex-col md:flex-row gap-6 relative z-10">
                        <div className="shrink-0 w-full md:w-32 h-32 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                          <img src={race.image} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{race.seriesName}</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">• ID: {race.subsessionId || 'N/A'}</span>
                          </div>
                          <h3 className="text-2xl font-racing font-bold text-white mb-6 group-hover:text-red-500 transition-colors italic truncate">{race.track}</h3>
                          
                          <div className="grid grid-cols-3 gap-2">
                            {raceSession.length > 0 ? raceSession.slice(0, 3).map((row, idx) => {
                              const driver = getDriver(row.cust_id.toString());
                              const nameToShow = driver ? driver.name.split(' ')[0] : row.display_name.split(' ')[0];
                              
                              return (
                                <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/50 flex flex-col items-center">
                                  <div className="relative mb-2">
                                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-racing font-bold text-[10px] ${
                                        idx === 0 ? 'bg-amber-500 text-slate-950' : 
                                        idx === 1 ? 'bg-slate-300 text-slate-950' : 'bg-orange-700 text-white'
                                     }`}>
                                       {idx + 1}
                                     </div>
                                     <img src={getCarBrandLogo(row.car_name)} className="absolute -bottom-1 -right-1 w-4 h-4 rounded-sm bg-white p-0.5 border border-slate-200 shadow-sm" />
                                  </div>
                                  <span className="text-[9px] font-bold text-white truncate w-full text-center">{nameToShow}</span>
                                  <span className="text-[8px] font-mono text-slate-500 mt-1">{formatInterval(row.interval)}</span>
                                </div>
                              );
                            }) : (
                               <div className="col-span-3 py-4 text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                  {language === 'en' ? 'Result pending...' : '结果统计中...'}
                               </div>
                            )}
                          </div>

                          <div className="mt-6 flex items-center justify-between">
                             <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase">
                                <Info size={12} className="text-red-500" /> {language === 'en' ? 'Click for Full Telemetry' : '点击查看完整赛报'}
                             </div>
                             {resultToShow && <ChevronRight className="text-slate-600 group-hover:text-red-500 group-hover:translate-x-1 transition-all" size={20} />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-12">
          {activeSeasons.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Zap size={20} className="text-red-500 fill-red-500" />
                <h2 className="text-xl font-racing font-bold text-white uppercase tracking-tight">{language === 'en' ? 'Active Seasons' : '进行中的赛季'}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeSeasons.map(season => (
                  <SeasonCard key={season.id} season={season} drivers={visibleDrivers} language={language} onClick={() => setSelectedSeason(season)} />
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center gap-3 mb-6">
              <History size={20} className="text-slate-500" />
              <h2 className="text-xl font-racing font-bold text-white uppercase tracking-tight">{language === 'en' ? 'Historical Records' : '赛季史册'}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archivedSeasons.map(season => (
                <SeasonCard key={season.id} season={season} drivers={visibleDrivers} language={language} onClick={() => setSelectedSeason(season)} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Archives;
