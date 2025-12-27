
import React from 'react';
import { X, Thermometer, Droplets, ArrowUpRight, ArrowDownRight, Minus, Timer, Info } from 'lucide-react';
import { IRacingEventResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatIRacingTime, formatInterval, getCarBrandLogo } from '../utils/racingUtils';

interface RaceDetailModalProps {
  result: IRacingEventResult;
  onClose: () => void;
}

const RaceDetailModal: React.FC<RaceDetailModalProps> = ({ result, onClose }) => {
  const { language } = useLanguage();
  const raceSession = result.session_results.find(s => s.simsession_type_name === "Race")?.results || [];
  
  // Calculate fastest lap of the race
  const fastestLapTime = Math.min(...raceSession.filter(r => r.best_lap_time > 0).map(r => r.best_lap_time));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900 w-full max-w-6xl rounded-[32px] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-8 border-b border-slate-800 flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-black text-red-600 uppercase tracking-widest">{result.league_name} Official Result</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase">ID: {result.subsession_id}</span>
            </div>
            <h2 className="text-3xl font-racing font-bold text-white uppercase italic">{result.track.track_name}</h2>
            <p className="text-slate-500 text-sm font-medium">{result.track.config_name}</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-6">
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Strength of Field</p>
                  <p className="text-xl font-racing font-bold text-white">{result.event_strength_of_field}</p>
               </div>
               <div className="flex gap-4 border-l border-slate-800 pl-6">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Thermometer size={16} className="text-red-500" />
                    <span className="text-sm font-bold">{result.weather.temp_value}°C</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Droplets size={16} className="text-blue-500" />
                    <span className="text-sm font-bold">{result.weather.rel_humidity}%</span>
                  </div>
               </div>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-900 z-10 shadow-sm border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Pos</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Driver</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Car</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Interval</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Best Lap</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Inc</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">{language === 'en' ? 'Points' : '赛季积分'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {raceSession.map((row) => {
                const posChange = row.starting_position - row.finish_position;
                const isFastestLap = row.best_lap_time === fastestLapTime;

                return (
                  <tr key={row.cust_id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-racing font-bold text-white">{(row.finish_position + 1).toString().padStart(2, '0')}</span>
                        {posChange > 0 ? (
                          <div className="flex items-center text-green-500 gap-0.5 text-[10px] font-bold">
                            <ArrowUpRight size={12} /> {posChange}
                          </div>
                        ) : posChange < 0 ? (
                          <div className="flex items-center text-red-500 gap-0.5 text-[10px] font-bold">
                            <ArrowDownRight size={12} /> {Math.abs(posChange)}
                          </div>
                        ) : (
                          <div className="text-slate-600"><Minus size={12} /></div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-white text-sm">{row.display_name}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Start Pos: {row.starting_position + 1}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <img src={getCarBrandLogo(row.car_name)} className="h-4 w-auto grayscale brightness-200 opacity-60" />
                        <span className="text-[11px] font-medium text-slate-400 max-w-[140px] truncate">{row.car_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[11px] font-mono font-bold ${row.interval === 0 ? 'text-amber-500' : 'text-slate-300'}`}>
                        {formatInterval(row.interval)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-mono ${isFastestLap ? 'text-purple-400 font-bold drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]' : 'text-slate-400'}`}>
                          {formatIRacingTime(row.best_lap_time)}
                        </span>
                        {isFastestLap && <Timer size={10} className="text-purple-400" />}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        row.incidents === 0 ? 'bg-green-500/10 text-green-500' : 
                        row.incidents > 10 ? 'bg-red-500/10 text-red-500' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {row.incidents}x
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="inline-flex items-center justify-center px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                          <span className="text-sm font-racing font-bold text-amber-500">{row.league_points || 0}</span>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RaceDetailModal;
