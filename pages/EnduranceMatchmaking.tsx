
import React, { useState } from 'react';
import { Plus, Users, Car, Calendar, MessageSquare, ShieldAlert, UserPlus, Flag, Target, TrendingUp, Trophy, Clock, Hash } from 'lucide-react';
import { MOCK_ENDURANCE_TEAMS } from '../constants';
import { EnduranceTeam, Driver, TeamGoal } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { formatLocalFull } from '../utils/racingUtils';

const EnduranceMatchmaking: React.FC = () => {
  const { t, language } = useLanguage();
  const { visibleDrivers, isAuthenticated } = useAuth();
  const [teams, setTeams] = useState<EnduranceTeam[]>(MOCK_ENDURANCE_TEAMS);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    raceName: '',
    car: '',
    series: 'CNA Endurance Masters',
    notes: '',
    maxMembers: 4,
    targetGoal: 'CASUAL' as TeamGoal,
    timeslot: 1,
    eventDateTime: new Date().toISOString().slice(0, 16) // Default local now
  });

  const getDriver = (id: string): Driver | undefined => visibleDrivers.find(d => d.id === id);

  const calculateAvgIRating = (memberIds: string[]) => {
    if (memberIds.length === 0) return 0;
    const total = memberIds.reduce((acc, id) => {
      const driver = getDriver(id);
      return acc + (driver?.iRating || 0);
    }, 0);
    return Math.round(total / memberIds.length);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h1 className="text-3xl font-racing font-black text-white italic tracking-tighter uppercase">{t.enduranceMatchmaking}</h1>
            <p className="text-slate-500 font-medium">{t.matchmakingDesc}</p>
        </div>
        <button 
            onClick={() => setShowModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transform hover:scale-105 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 uppercase text-sm"
        >
            <Plus size={20} /> {t.postRecruitment}
        </button>
      </header>

      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-4">
        <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" />
        <div>
            <h4 className="font-bold text-amber-500 text-sm">{t.safetyNotice}</h4>
            <p className="text-xs text-amber-500/80">{t.safetyDesc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {teams.map(team => {
            const avgIR = calculateAvgIRating(team.members);
            return (
              <div key={team.id} className="bg-slate-900 rounded-[32px] border border-slate-800 overflow-hidden hover:border-slate-600 transition-all flex flex-col lg:flex-row group shadow-2xl">
                  {/* Team Info Panel */}
                  <div className="lg:w-1/3 bg-slate-950 p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 relative">
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-red-600/10 border border-red-600/30 rounded-full z-10">
                        <Hash size={10} className="text-red-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{t.slotLabel} {team.timeslot} {language === 'en' ? 'Session' : '场'}</span>
                      </div>

                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center">
                          <Flag className="text-red-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-racing font-bold text-white text-xl truncate max-w-[180px]">{team.name}</h3>
                          <div className={`mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                            team.targetGoal === 'COMPETITIVE' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'
                          }`}>
                            <Target size={10} />
                            {team.targetGoal === 'COMPETITIVE' ? t.competitive : t.casual}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3 text-slate-400">
                          <Car size={16} className="text-red-500" />
                          <span className="text-sm font-medium">{team.car}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                          <Clock size={16} className="text-red-500" />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.startTime}</span>
                            <span className="text-xs font-bold text-white">{formatLocalFull(team.eventDateTime)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                          <TrendingUp size={16} className="text-red-500" />
                          <span className="text-sm font-bold text-white">{t.avgTeamIR}: {avgIR}</span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-400 italic mb-8 flex-1 line-clamp-3">"{team.notes}"</p>

                      <button className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 uppercase shadow-lg shadow-red-600/10">
                          <UserPlus size={18} /> {t.sendMessage}
                      </button>
                  </div>

                  {/* Roster Panel */}
                  <div className="flex-1 p-8 bg-slate-900/50">
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">{t.teamMembers}</h4>
                      <div className="px-4 py-1.5 bg-slate-950 rounded-full border border-slate-800 text-[10px] font-black text-slate-400 shadow-inner">
                        {team.members.length} / {team.maxMembers} {t.slotsAvailable.toUpperCase()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {team.members.map(memberId => {
                        const driver = getDriver(memberId);
                        const nameToDisplay = driver ? driver.name : (isAuthenticated ? 'Member Not Found' : 'Confidential Member');
                        const avatarToDisplay = driver ? driver.avatar : 'https://i.pravatar.cc/150?u=anon';
                        
                        return (
                          <div key={memberId} className="flex items-center gap-4 p-4 bg-slate-950/40 rounded-2xl border border-slate-800/50 hover:bg-slate-950 transition-colors shadow-sm">
                            <img src={avatarToDisplay} className="w-12 h-12 rounded-xl object-cover border border-slate-800" alt="Avatar" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-white truncate">{nameToDisplay}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 uppercase font-bold">{driver?.country || 'N/A'}</span>
                                <div className="w-1 h-1 rounded-full bg-slate-700" />
                                <span className="text-[10px] text-red-500 font-black">{driver?.iRating || 0} iR</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {Array.from({ length: Math.max(0, team.maxMembers - team.members.length) }).map((_, i) => (
                        <div key={`empty-${i}`} className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20 opacity-40">
                          <UserPlus size={16} className="text-slate-700 mb-1" />
                          <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Reserved</span>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>
            );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="bg-slate-900 w-full max-w-2xl rounded-[40px] border border-slate-800 shadow-2xl p-8 md:p-12 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-red-600 rounded-2xl text-white">
                    <Flag size={24} />
                  </div>
                  <h2 className="text-3xl font-racing font-bold text-white uppercase tracking-tighter">{t.postRecruitment}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest">{t.teamName}</label>
                          <input 
                            type="text" 
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-red-600 outline-none transition-all" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest">{t.eventTarget}</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 24 Hours of Spa"
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-red-600 outline-none transition-all" 
                            value={formData.raceName}
                            onChange={(e) => setFormData({...formData, raceName: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest">{t.selectSlot}</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map(s => (
                              <button 
                                key={s}
                                onClick={() => setFormData({...formData, timeslot: s})}
                                className={`py-3 rounded-xl border font-bold text-xs transition-all ${
                                  formData.timeslot === s ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                                }`}
                              >
                                {t.slotLabel} {s} {language === 'en' ? '' : '场'}
                              </button>
                            ))}
                          </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest">{t.startTime}</label>
                          <input 
                            type="datetime-local" 
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-red-600 outline-none transition-all" 
                            value={formData.eventDateTime}
                            onChange={(e) => setFormData({...formData, eventDateTime: e.target.value})}
                          />
                      </div>
                      
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest">{t.maxDrivers}</label>
                          <div className="flex items-center gap-6 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                            <input 
                              type="range" 
                              min="2" 
                              max="16" 
                              className="flex-1 accent-red-600"
                              value={formData.maxMembers}
                              onChange={(e) => setFormData({...formData, maxMembers: parseInt(e.target.value)})}
                            />
                            <span className="text-2xl font-racing font-bold text-white w-10">{formData.maxMembers}</span>
                          </div>
                      </div>

                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest">Team Notes</label>
                          <textarea 
                            rows={2} 
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-red-600 outline-none transition-all resize-none" 
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                          />
                      </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-10">
                    <button onClick={() => setShowModal(false)} className="flex-1 py-5 bg-slate-800 text-white font-bold rounded-2xl uppercase text-sm tracking-widest hover:bg-slate-700 transition-all">CANCEL</button>
                    <button onClick={() => setShowModal(false)} className="flex-1 py-5 bg-red-600 text-white font-bold rounded-2xl shadow-[0_10px_30px_rgba(220,38,38,0.3)] uppercase text-sm tracking-widest hover:bg-red-700 transition-all">CREATE SQUAD</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default EnduranceMatchmaking;
