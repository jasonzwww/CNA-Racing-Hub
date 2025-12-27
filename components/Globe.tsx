
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  select, 
  geoOrthographic, 
  geoPath, 
  geoGraticule, 
  geoDistance, 
  json, 
  drag as d3Drag, 
  timer 
} from 'd3';
import { Driver } from '../types';
import { X, Trophy, Shield, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Globe: React.FC = () => {
  const { t } = useLanguage();
  const { visibleDrivers } = useAuth();
  const svgRef = useRef<SVGSVGElement>(null);
  const rotationRef = useRef<[number, number]>([0, -10]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  useEffect(() => {
    if (!svgRef.current) return;
    const width = 600;
    const height = 600;
    const sensitivity = 0.25;
    const svg = select(svgRef.current).attr('viewBox', `0 0 ${width} ${height}`).style('width', '100%').style('height', 'auto').style('cursor', 'grab');
    svg.selectAll('*').remove();
    const projection = geoOrthographic().scale(250).center([0, 0]).rotate(rotationRef.current).translate([width / 2, height / 2]);
    const path = geoPath().projection(projection as any);
    const graticule = svg.append('path').datum(geoGraticule()).attr('class', 'graticule').style('fill', 'none').style('stroke', '#1e293b').style('stroke-width', '0.5px');
    const sphere = svg.append('path').datum({ type: 'Sphere' }).attr('class', 'water').style('fill', '#020617');
    const countriesGroup = svg.append('g');
    const driversGroup = svg.append('g');

    function render() {
      projection.rotate(rotationRef.current);
      graticule.attr('d', path as any);
      sphere.attr('d', path as any);
      countriesGroup.selectAll('path').attr('d', path as any);
      driversGroup.selectAll('circle').attr('cx', (d: any) => {
          const coords = projection([d.lng, d.lat]);
          return coords ? coords[0] : 0;
        }).attr('cy', (d: any) => {
          const coords = projection([d.lng, d.lat]);
          return coords ? coords[1] : 0;
        }).style('display', (d: any) => {
          const gdistance = geoDistance([d.lng, d.lat], projection.invert!([width / 2, height / 2]) as [number, number]);
          return gdistance > Math.PI / 2 ? 'none' : 'block';
        });
    }

    json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then((data: any) => {
      countriesGroup.selectAll('path').data(data.features).enter().append('path').style('fill', '#1e293b').style('stroke', '#334155').style('stroke-width', '0.5px');
      driversGroup.selectAll('circle').data(visibleDrivers).enter().append('circle').attr('r', 8).attr('fill', '#ef4444').attr('stroke', '#fff').attr('stroke-width', 2).attr('class', 'cursor-pointer hover:fill-white transition-colors').style('filter', 'drop-shadow(0 0 5px rgba(239, 68, 68, 0.8))').on('click', (event, d: Driver) => {
            event.stopPropagation();
            setSelectedDriver(d);
            setIsAutoRotating(false);
        });
      render();
    });

    const dragBehavior = d3Drag<SVGSVGElement, unknown>().on('start', () => { svg.style('cursor', 'grabbing'); setIsAutoRotating(false); }).on('drag', (event) => {
        const rotate = rotationRef.current;
        rotationRef.current = [rotate[0] + event.dx * sensitivity, rotate[1] - event.dy * sensitivity];
        render();
      }).on('end', () => { svg.style('cursor', 'grab'); });
    svg.call(dragBehavior as any);
    svg.on('click', () => setSelectedDriver(null));
    const rotationTimer = timer(() => { if (isAutoRotating) { rotationRef.current[0] += 0.2; render(); } });
    return () => rotationTimer.stop();
  }, [isAutoRotating, visibleDrivers]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-[600px] aspect-square rounded-full shadow-[0_0_80px_rgba(239,68,68,0.1)] bg-slate-950 overflow-hidden select-none border border-slate-800">
        <svg ref={svgRef} className="touch-none w-full h-full" />
        {selectedDriver && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-slate-900/90 backdrop-blur-md border border-red-500/50 rounded-2xl p-5 shadow-2xl animate-in zoom-in-95 fade-in duration-200 pointer-events-auto">
                <button onClick={() => setSelectedDriver(null)} className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
                <div className="flex flex-col items-center text-center">
                    <img src={selectedDriver.avatar} className="w-16 h-16 rounded-xl border-2 border-red-500 mb-3" alt="Driver" />
                    <h3 className="font-racing font-bold text-white text-lg leading-tight mb-1">{selectedDriver.name}</h3>
                    <p className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4"><MapPin size={10} className="text-red-500" /> {selectedDriver.country}</p>
                    <div className="grid grid-cols-2 gap-2 w-full">
                        <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                            <div className="flex items-center justify-center gap-1 text-[8px] font-bold text-slate-500 uppercase mb-1"><Trophy size={8} className="text-amber-500" /> iRating</div>
                            <div className="text-sm font-racing font-bold text-white">{selectedDriver.iRating}</div>
                        </div>
                        <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                            <div className="flex items-center justify-center gap-1 text-[8px] font-bold text-slate-500 uppercase mb-1"><Shield size={8} className="text-blue-500" /> SR</div>
                            <div className="text-sm font-racing font-bold text-white">{selectedDriver.safetyRating.split(' ')[0]}</div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        {!isAutoRotating && !selectedDriver && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="bg-slate-950/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-800 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.manualMode}</span>
                    <button onClick={(e) => { e.stopPropagation(); setIsAutoRotating(true); }} className="pointer-events-auto ml-2 text-red-500 hover:text-red-400 text-[10px] font-black underline underline-offset-2 uppercase">{t.resume}</button>
                </div>
            </div>
        )}
      </div>
      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {visibleDrivers.map(driver => (
            <button key={driver.id} onClick={() => setSelectedDriver(driver)} className={`flex items-center gap-3 bg-slate-900/40 p-3 rounded-xl border transition-all hover:bg-slate-800/60 ${selectedDriver?.id === driver.id ? 'border-red-500/50 bg-red-500/5' : 'border-slate-800'}`}>
                <img src={driver.avatar} className="w-8 h-8 rounded-lg" alt="Driver" />
                <div className="text-left">
                    <p className="text-xs font-bold text-white truncate max-w-[100px]">{driver.name}</p>
                    <p className="text-[9px] text-slate-500 uppercase font-medium">{driver.country}</p>
                </div>
                <div className={`ml-auto w-1.5 h-1.5 rounded-full ${driver.status === 'Online' ? 'bg-green-500' : driver.status === 'Racing' ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
            </button>
        ))}
      </div>
    </div>
  );
};

export default Globe;
