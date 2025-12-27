
import React, { useState } from 'react';
import { Search, Trophy, Shield, Info, Activity, MapPin, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Driver } from '../types';
import DriverDetailModal from '../components/DriverDetailModal';

const Drivers: React.FC = () => {
  const { t } = useLanguage();
  const { visibleDrivers } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const filteredDrivers = visibleDrivers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.cnaDriverNumber?.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {selectedDriver && <DriverDetailModal driver={selectedDriver} onClose={() => setSelectedDriver(null)} />}

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h1 className="text-3xl font-racing font-black text-white italic tracking-tighter uppercase">{t.driverStatus}</h1>
            <p className="text-slate-500 font-medium">{t.driverDesc}</p>
        </div>
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
                type="text" 
                placeholder={t.searchDrivers}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-6 text-white focus:outline-none focus:border-red-600 transition-all w-full md:w-64"
            />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
            <div 
              key={driver.id} 
              onClick={() => setSelectedDriver(driver)}
              className="bg-slate-900 rounded-3xl border border-slate-800 p-6 hover:shadow-2xl transition-all group hover:border-red-600/30 relative overflow-hidden cursor-pointer"
            >
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                   <span className="text-6xl font-racing font-black italic text-white leading-none">{driver.cnaDriverNumber || '??'}</span>
                </div>

                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img src={driver.avatar} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-800" />
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 shadow-sm ${
                                driver.status === 'Online' ? 'bg-green-500' : 
                                driver.status === 'Racing' ? 'bg-red-500 animate-pulse' : 'bg-slate-600'
                            }`} title={driver.status} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-lg font-racing font-bold text-white leading-tight truncate flex items-center gap-2">
                               {driver.name}
                               <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded italic">#{driver.cnaDriverNumber || '--'}</span>
                            </h3>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                <MapPin size={10} /> {driver.country}
                            </div>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-sm bg-slate-800 ${
                            driver.safetyRating.startsWith('A') ? 'text-blue-400' : 'text-amber-400'
                        }`}>SR {driver.safetyRating}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                            <Activity size={10} className="text-blue-500" /> iRating
                        </p>
                        <p className="text-xl font-racing font-bold text-white tracking-tighter">{driver.iRating}</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                            <Hash size={10} className="text-amber-500" /> iR ID
                        </p>
                        <p className="text-base font-racing font-bold text-slate-400 tracking-tighter">{driver.id}</p>
                    </div>
                </div>

                <button className="w-full py-2.5 bg-slate-800 group-hover:bg-red-600 text-slate-300 group-hover:text-white rounded-xl text-xs font-bold transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                    <Info size={14} /> {t.viewProfile}
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Drivers;
