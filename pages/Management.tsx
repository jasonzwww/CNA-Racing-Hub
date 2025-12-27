
'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileJson, Image as ImageIcon, Save, Trash2, CheckCircle, AlertCircle, Database, ChevronRight, MapPin, Calendar, Flag, Trophy, ShieldAlert, Users, Hash, Search, Key, ShieldCheck, UserPlus, ShieldX, Clock, Plus, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { IRacingEventResult, SeriesId, LocalManagedRace, RaceStatus, Driver, Race } from '../types';
import { MOCK_SEASONS, MOCK_SERIES } from '../constants';
import { formatLocalFull } from '../utils/racingUtils';

const STORAGE_KEY = 'cna_managed_races';
const SCHEDULE_STORAGE_KEY = 'cna_managed_schedule';

const Management: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, allDrivers, updateDriverInfo, admins, addAdmin, removeAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [managedRaces, setManagedRaces] = useState<LocalManagedRace[]>([]);
  const [managedSchedule, setManagedSchedule] = useState<Race[]>([]);
  const [activeTab, setActiveTab] = useState<'RACES' | 'DRIVERS' | 'ACCESS' | 'SCHEDULE'>('RACES');
  
  const [jsonContent, setJsonContent] = useState<IRacingEventResult | null>(null);
  const [trackImage, setTrackImage] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(MOCK_SEASONS[0].id);
  const [selectedSeries, setSelectedSeries] = useState<SeriesId>('GT3_OPEN');
  const [isSaving, setIsSaving] = useState(false);

  const [newRaceForm, setNewRaceForm] = useState({
    track: '',
    seasonId: MOCK_SEASONS[0].id,
    seriesId: 'GT3_OPEN' as SeriesId,
    dateTime: '',
    duration: 45,
    imageUrl: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=800&auto=format&fit=crop'
  });

  const [driverSearch, setDriverSearch] = useState('');
  const [newAdminId, setNewAdminId] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/');
      return;
    }

    const savedRaces = localStorage.getItem(STORAGE_KEY);
    if (savedRaces) {
      try { setManagedRaces(JSON.parse(savedRaces)); } catch (e) {}
    }

    const savedSchedule = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (savedSchedule) {
      try { setManagedSchedule(JSON.parse(savedSchedule)); } catch (e) {}
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.subsession_id && json.session_results) {
          setJsonContent(json);
        } else {
          alert(language === 'en' ? "Invalid iRacing JSON format" : "无效的 iRacing JSON 格式");
        }
      } catch (e) {
        alert(language === 'en' ? "Failed to parse JSON" : "解析 JSON 失败");
      }
    };
    reader.readAsText(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setTrackImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveRace = () => {
    if (!jsonContent) return;
    setIsSaving(true);
    setTimeout(() => {
      const raceSession = jsonContent.session_results.find(s => s.simsession_type_name === "Race")?.results || [];
      const winnerName = raceSession.length > 0 ? raceSession[0].display_name : "N/A";
      const newRace: LocalManagedRace = {
        id: `local-${jsonContent.subsession_id}`,
        seasonId: selectedSeason,
        seriesId: selectedSeries,
        seriesName: MOCK_SERIES.find(s => s.id === selectedSeries)?.name || "",
        track: jsonContent.track.track_name,
        dateTime: new Date().toISOString(),
        status: RaceStatus.COMPLETED,
        winner: winnerName,
        image: trackImage || "https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=800&auto=format&fit=crop",
        subsessionId: jsonContent.subsession_id,
        detailedResult: jsonContent,
        uploadDate: new Date().toISOString()
      };
      const updated = [newRace, ...managedRaces];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setManagedRaces(updated);
      setJsonContent(null);
      setTrackImage(null);
      setIsSaving(false);
      alert(language === 'en' ? "Race data saved successfully!" : "比赛数据保存成功！");
    }, 800);
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRaceForm.track || !newRaceForm.dateTime) return;
    const newRace: Race = {
      id: `sched-${Date.now()}`,
      seasonId: newRaceForm.seasonId,
      seriesId: newRaceForm.seriesId,
      seriesName: MOCK_SERIES.find(s => s.id === newRaceForm.seriesId)?.name || "",
      track: newRaceForm.track,
      dateTime: new Date(newRaceForm.dateTime).toISOString(),
      status: RaceStatus.UPCOMING,
      durationMinutes: newRaceForm.duration,
      image: newRaceForm.imageUrl
    };
    const updated = [newRace, ...managedSchedule];
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(updated));
    setManagedSchedule(updated);
    setNewRaceForm({ ...newRaceForm, track: '', dateTime: '' });
    alert(t.eventAdded);
  };

  const handleDeleteRace = (id: string) => {
    if (confirm(language === 'en' ? "Delete this race record?" : "确定要删除这条比赛记录吗？")) {
      const updated = managedRaces.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setManagedRaces(updated);
    }
  };

  const handleDeleteSchedule = (id: string) => {
    if (confirm(language === 'en' ? "Remove this event from schedule?" : "确定要从赛程表中移除该赛事吗？")) {
      const updated = managedSchedule.filter(r => r.id !== id);
      localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(updated));
      setManagedSchedule(updated);
    }
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminId.trim()) return;
    addAdmin(newAdminId.trim());
    setNewAdminId('');
    alert(t.updateSuccess);
  };

  const filteredDrivers = allDrivers.filter(d => d.name.toLowerCase().includes(driverSearch.toLowerCase()) || d.id.includes(driverSearch));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-racing font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
            <Database className="text-red-500" /> {t.manageData}
          </h1>
          <p className="text-slate-500 font-medium">{language === 'en' ? "Administrative panel for CNA Racing league." : "CNA Racing 联赛管理面板。"}</p>
        </div>
        <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          <button onClick={() => setActiveTab('RACES')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${activeTab === 'RACES' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}><Trophy size={14} /> {language === 'en' ? 'Race Results' : '比赛结果'}</button>
          <button onClick={() => setActiveTab('SCHEDULE')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${activeTab === 'SCHEDULE' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}><Calendar size={14} /> {t.manageSchedule}</button>
          <button onClick={() => setActiveTab('DRIVERS')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${activeTab === 'DRIVERS' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}><Users size={14} /> {t.manageDrivers}</button>
          <button onClick={() => setActiveTab('ACCESS')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${activeTab === 'ACCESS' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}><Key size={14} /> {t.accessControl}</button>
        </div>
      </header>

      {activeTab === 'RACES' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900 rounded-[32px] border border-slate-800 p-8 shadow-2xl space-y-8 h-fit">
            <h2 className="text-xl font-racing font-bold text-white uppercase italic">{t.uploadResults}</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.uploadJson}</label>
                <div className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${jsonContent ? 'border-green-500/50 bg-green-500/5' : 'border-slate-800 bg-slate-950 hover:border-red-600/50'}`}>
                  <input type="file" accept=".json" onChange={handleJsonUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {jsonContent ? (<><CheckCircle className="text-green-500 mb-2" size={32} /><p className="text-sm font-bold text-white">{t.jsonSuccess}</p></>) : (<><FileJson className="text-slate-700 mb-2" size={32} /><p className="text-sm font-bold text-slate-500">{t.noFile}</p></>)}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.uploadImage}</label>
                <div className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${trackImage ? 'border-green-500/50 bg-green-500/5' : 'border-slate-800 bg-slate-950 hover:border-red-600/50'}`}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {trackImage ? (<div className="flex flex-col items-center"><img src={trackImage} className="w-24 h-24 object-cover rounded-xl border border-slate-800 mb-2" /><p className="text-sm font-bold text-white">{t.imgSuccess}</p></div>) : (<><ImageIcon className="text-slate-700 mb-2" size={32} /><p className="text-sm font-bold text-slate-500">{t.noFile}</p></>)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm">{MOCK_SEASONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
                <select value={selectedSeries} onChange={(e) => setSelectedSeries(e.target.value as SeriesId)} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm">{MOCK_SERIES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
              </div>
              <button disabled={!jsonContent || isSaving} onClick={handleSaveRace} className="w-full py-5 bg-red-600 hover:bg-red-700 disabled:bg-slate-800 text-white font-bold rounded-2xl uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {t.saveRace}
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-racing font-bold text-white uppercase italic">{t.managedList}</h2>
            <div className="space-y-4">
              {managedRaces.map(race => (
                <div key={race.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex items-center gap-6 group">
                  <img src={race.image} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-800" />
                  <div className="flex-1 min-w-0"><div className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">{race.seriesName}</div><h3 className="text-lg font-racing font-bold text-white truncate italic">{race.track}</h3><div className="text-[10px] text-slate-500 font-bold uppercase mt-1">Winner: {race.winner}</div></div>
                  <button onClick={() => handleDeleteRace(race.id)} className="p-3 text-slate-600 hover:text-red-500 transition-all"><Trash2 size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'SCHEDULE' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900 rounded-[32px] border border-slate-800 p-8 shadow-2xl space-y-8 h-fit">
            <h2 className="text-xl font-racing font-bold text-white uppercase italic">{t.addEvent}</h2>
            <form onSubmit={handleAddSchedule} className="space-y-6">
              <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.trackName}</label><div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} /><input type="text" value={newRaceForm.track} onChange={(e) => setNewRaceForm({...newRaceForm, track: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-white focus:border-red-600 outline-none transition-all" placeholder="e.g. Spa-Francorchamps" required /></div></div>
              <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.startTime}</label><input type="datetime-local" value={newRaceForm.dateTime} onChange={(e) => setNewRaceForm({...newRaceForm, dateTime: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-red-600 outline-none transition-all" required /></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.eventDuration}</label><div className="relative"><Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} /><input type="number" value={newRaceForm.duration} onChange={(e) => setNewRaceForm({...newRaceForm, duration: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-white focus:border-red-600 outline-none transition-all" required /></div></div></div>
              <div className="grid grid-cols-2 gap-4"><select value={newRaceForm.seasonId} onChange={(e) => setNewRaceForm({...newRaceForm, seasonId: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm">{MOCK_SEASONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select><select value={newRaceForm.seriesId} onChange={(e) => setNewRaceForm({...newRaceForm, seriesId: e.target.value as SeriesId})} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm">{MOCK_SERIES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
              <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.eventImage}</label><input type="text" value={newRaceForm.imageUrl} onChange={(e) => setNewRaceForm({...newRaceForm, imageUrl: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-red-600 outline-none transition-all" /></div>
              <button type="submit" className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl uppercase tracking-widest transition-all flex items-center justify-center gap-3"><Plus size={20} /> {t.saveEvent}</button>
            </form>
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-racing font-bold text-white uppercase italic">{language === 'en' ? 'Upcoming Schedule' : '排期中的赛事'}</h2>
            <div className="space-y-4">
              {managedSchedule.map(race => (
                <div key={race.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex items-center gap-6 group">
                  <img src={race.image} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-800" />
                  <div className="flex-1 min-w-0"><div className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">{race.seriesName}</div><h3 className="text-lg font-racing font-bold text-white truncate italic">{race.track}</h3><div className="text-[10px] text-slate-500 font-bold uppercase mt-1">{formatLocalFull(race.dateTime)}</div></div>
                  <button onClick={() => handleDeleteSchedule(race.id)} className="p-3 text-slate-600 hover:text-red-500 transition-all"><Trash2 size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'DRIVERS' ? (
        <div className="space-y-6">
          <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type="text" placeholder={t.searchDrivers} className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-white focus:border-red-600 outline-none transition-all" value={driverSearch} onChange={(e) => setDriverSearch(e.target.value)} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map(driver => (
              <div key={driver.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
                 <div className="flex items-center gap-4 mb-6"><img src={driver.avatar} className="w-16 h-16 rounded-2xl border-2 border-slate-800" /><div><h3 className="text-lg font-racing font-bold text-white truncate">{driver.name}</h3><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {driver.id}</p></div></div>
                 <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.cnaNumber}</label><input type="text" maxLength={3} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm" value={driver.cnaDriverNumber || ''} onChange={(e) => updateDriverInfo(driver.id, { cnaDriverNumber: e.target.value })} /></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
           <div className="bg-slate-900 rounded-[32px] border border-slate-800 p-8 shadow-2xl space-y-8">
              <div className="flex items-center gap-4"><div className="p-3 bg-red-600/10 rounded-2xl text-red-500"><ShieldCheck size={28} /></div><div><h2 className="text-xl font-racing font-bold text-white uppercase italic">{t.accessControl}</h2><p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{t.authWarning}</p></div></div>
              <form onSubmit={handleAddAdmin} className="flex gap-4"><input type="text" placeholder={t.adminIdPlaceholder} value={newAdminId} onChange={(e) => setNewAdminId(e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-white outline-none" /><button type="submit" className="px-8 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl uppercase tracking-widest transition-all">{t.addAdmin}</button></form>
              <div className="space-y-2">
                 {admins.map(adminId => (
                   <div key={adminId} className="bg-slate-950/50 rounded-2xl border border-slate-800 p-4 flex items-center justify-between"><div className="text-white font-bold">ID: {adminId}</div>{user?.id !== adminId && <button onClick={() => removeAdmin(adminId)} className="text-slate-600 hover:text-red-500"><ShieldX size={20} /></button>}</div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Management;
