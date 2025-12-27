
'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_STANDINGS, MOCK_ENDURANCE_TEAMS, MOCK_RACES } from '../constants';
import { Trophy, Activity, Shield, MapPin, Users, Car, Flag, History, ArrowRight, Hash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatLocalDateOnly } from '../utils/racingUtils';

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return null;
  }

  const userStandings = MOCK_STANDINGS.filter(s => s.driverId === user.id);
  const myTeams = MOCK_ENDURANCE_TEAMS.filter(team => team.members.includes(user.id));
  const totalPoints = userStandings.reduce((acc, s) => acc + s.points, 0);
  const totalWins = userStandings.reduce((acc, s) => acc + s.wins, 0);
  const totalPodiums = userStandings.reduce((acc, s) => acc + s.podiums, 0);
  const totalRaces = userStandings.reduce((acc, s) => acc + s.racesRun, 0);
  const userSeriesIds = Array.from(new Set(userStandings.map(s => s.seriesId)));
  const myRecentRaces = MOCK_RACES.filter(r => userSeriesIds.includes(r.seriesId)).slice(0, 3);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="relative bg-slate-900 rounded-[40px] border border-slate-800 p-8 md:p-12 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <img src={user.avatar} className="w-32 h-32 md:w-48 md:h-48 rounded-[32px] border-4 border-slate-800 shadow-2xl object-cover" alt={user.name} />
            <div className="absolute -bottom-4 -right-4 bg-white text-slate-950 px-6 py-2 rounded-2xl shadow-2xl border-4 border-slate-900 flex flex-col items-center justify-center transform hover:scale-110 transition-transform cursor-help group">
               <span className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-0.5">CNA NO.</span>
               <span className="text-4xl font-racing font-black italic leading-none">{user.cnaDriverNumber || '--'}</span>
               <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] px-3 py-1.5 rounded-lg border border-slate-800 hidden group-hover:block whitespace-nowrap shadow-2xl">
                  {language === 'en' ? 'Verified CNA Member Number' : '已认证 CNA 车手编号'}
               </div>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-racing font-black text-white italic tracking-tighter uppercase">{user.name}</h1>
              <span className="px-4 py-1.5 bg-red-600/10 border border-red-600/30 text-red-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] w-fit mx-auto md:mx-0">
                {user.isAdmin ? 'League Admin' : 'Official Driver'}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-400 mb-8 font-medium">
              <div className="flex items-center gap-2"><MapPin size={18} className="text-red-500" /><span>{user.country}</span></div>
              <div className="flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${user.status === 'Online' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} /><span className="uppercase text-xs font-bold">{user.status}</span></div>
              <div className="px-3 py-1 bg-slate-950 rounded-lg border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Hash size={12} /> {t.iracingId}: {user.id}</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800"><p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t.rank}</p><p className="text-2xl font-racing font-bold text-white italic">#34</p></div>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800"><p className="text-[10px] font-bold text-slate-500 uppercase mb-1">iRating</p><p className="text-2xl font-racing font-bold text-red-500 italic">{user.iRating}</p></div>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800"><p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Safety</p><p className="text-2xl font-racing font-bold text-blue-400 italic">{user.safetyRating}</p></div>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800"><p className="text-[10px] font-bold text-slate-500 uppercase mb-1">CNA Points</p><p className="text-2xl font-racing font-bold text-amber-500 italic">{totalPoints}</p></div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6">
            <h3 className="text-lg font-racing font-bold text-white uppercase italic mb-6 flex items-center gap-3"><Activity className="text-red-500" /> {t.careerStats}</h3>
            <div className="space-y-4">
              {[
                { label: t.wins, val: totalWins, icon: Trophy, color: 'text-amber-500' },
                { label: t.podiums, val: totalPodiums, icon: Shield, color: 'text-blue-400' },
                { label: t.races, val: totalRaces, icon: Flag, color: 'text-slate-400' },
                { label: t.avgFinish, val: '4.2', icon: Activity, color: 'text-red-500' },
                { label: t.incidentsPerRace, val: '3.1', icon: Shield, color: 'text-orange-500' },
                { label: t.totalLaps, val: '1,420', icon: History, color: 'text-emerald-500' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-950/40 rounded-xl border border-slate-800/50">
                  <div className="flex items-center gap-3"><stat.icon size={16} className={stat.color} /><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span></div>
                  <span className="text-lg font-racing font-bold text-white">{stat.val}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6">
            <h3 className="text-lg font-racing font-bold text-white uppercase italic mb-6 flex items-center gap-3"><Users className="text-red-500" /> {t.myTeams}</h3>
            <div className="space-y-4">
              {myTeams.length > 0 ? myTeams.map(team => (
                <Link to="/matchmaking" key={team.id} className="block group">
                  <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/50 group-hover:border-red-600/50 transition-all">
                    <div className="flex items-center justify-between mb-2"><h4 className="font-bold text-white text-sm">{team.name}</h4><span className="text-[10px] font-black text-red-500 uppercase">{team.targetGoal}</span></div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase"><Car size={12} /> {team.car}</div>
                  </div>
                </Link>
              )) : (<p className="text-center py-8 text-xs text-slate-600 font-bold uppercase">No squads joined yet.</p>)}
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section className="bg-slate-900/50 rounded-[32px] border border-slate-800 p-8 h-full flex flex-col">
            <h3 className="text-xl font-racing font-bold text-white uppercase italic mb-8 flex items-center gap-3"><History className="text-red-500" /> {t.myCareer}</h3>
            <div className="flex-1 space-y-4">
              {myRecentRaces.length > 0 ? myRecentRaces.map(race => (
                <div key={race.id} className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800/50 flex flex-col md:flex-row items-center gap-6 group">
                  <div className="w-full md:w-32 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0"><img src={race.image} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" alt={race.track} /></div>
                  <div className="flex-1 text-center md:text-left"><div className="flex items-center justify-center md:justify-start gap-2 mb-1"><span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{race.seriesName}</span><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">• {formatLocalDateOnly(race.dateTime)}</span></div><h4 className="text-lg font-racing font-bold text-white italic truncate">{race.track}</h4></div>
                  <div className="flex items-center gap-8 pr-4"><div className="text-center"><p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Finish</p><p className="text-xl font-racing font-bold text-white">#4</p></div><div className="text-center"><p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Inc</p><p className="text-xl font-racing font-bold text-slate-400">2x</p></div><ArrowRight className="text-slate-700 group-hover:text-red-500 transition-all" /></div>
                </div>
              )) : (<div className="flex-1 flex flex-col items-center justify-center py-20 text-center opacity-40"><Activity size={48} className="text-slate-500 mb-4" /><p className="font-bold uppercase tracking-widest text-xs text-slate-500">{t.noParticipation}</p></div>)}
            </div>
            <button className="mt-8 w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs uppercase tracking-widest transition-all">Load Full Career History</button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
