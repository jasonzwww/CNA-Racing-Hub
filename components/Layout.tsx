
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Trophy, Users, Globe as GlobeIcon, UsersRound, MessageSquare, History, Menu, X, Languages, LogIn, LogOut, Settings, Database, UserCircle } from 'lucide-react';
import { LEAGUE_NAME } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();

  const navItems = [
    { label: t.dashboard, icon: LayoutDashboard, path: '/', adminOnly: false },
    { label: t.schedule, icon: Calendar, path: '/schedule', adminOnly: false },
    { label: t.standings, icon: Trophy, path: '/standings', adminOnly: false },
    { label: t.archives, icon: History, path: '/archives', adminOnly: false },
    { label: t.drivers, icon: Users, path: '/drivers', adminOnly: false },
    { label: t.worldMap, icon: GlobeIcon, path: '/map', adminOnly: false },
    { label: t.enduranceFinder, icon: UsersRound, path: '/matchmaking', adminOnly: false },
    { label: t.aiSteward, icon: MessageSquare, path: '/ai-steward', adminOnly: false },
    { label: t.management, icon: Database, path: '/management', adminOnly: true },
  ];

  // Filter nav items based on user roles
  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly) {
      return user?.isAdmin === true;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Mobile Nav Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center font-bold text-white italic transform -skew-x-12">CNA</div>
            <h1 className="font-racing font-bold text-lg tracking-wider">{LEAGUE_NAME}</h1>
        </div>
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <button onClick={() => setIsLoginModalOpen(true)} className="text-red-500">
              <LogIn size={20} />
            </button>
          ) : (
            <Link to="/profile">
              <img src={user?.avatar} className="w-8 h-8 rounded-full border border-red-500" />
            </Link>
          )}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-300 transform 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:block
      `}>
        <div className="flex flex-col h-full">
          <div className="p-8 hidden md:block">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-600 rounded-md flex items-center justify-center font-bold text-xl text-white italic transform -skew-x-12 shadow-[0_0_15px_rgba(220,38,38,0.5)]">CNA</div>
                <h1 className="font-racing font-bold text-xl tracking-tighter leading-tight text-white">{LEAGUE_NAME}</h1>
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{t.officialPortal}</p>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 mt-4 md:mt-0 overflow-y-auto">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-red-600/10 text-red-500 border border-red-500/20 shadow-[0_0_20px_rgba(220,38,38,0.05)]' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <item.icon size={20} className={isActive ? 'text-red-500' : 'group-hover:text-white'} />
                  <span className="font-bold text-sm">{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800 space-y-4">
            {/* Auth Section */}
            {!isAuthenticated ? (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-red-600/50 transition-all font-bold text-sm shadow-xl"
              >
                <LogIn size={18} className="text-red-600" />
                {t.loginWithIRacing}
              </button>
            ) : (
              <div className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-4 flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img src={user?.avatar} className="w-10 h-10 rounded-xl border border-red-500/30" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm truncate">{user?.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-red-500 font-black">{user?.iRating} iR</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">{user?.safetyRating}</span>
                    </div>
                    {user?.isAdmin && (
                      <span className="text-[8px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black uppercase mt-1 inline-block">Admin</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 border-t border-slate-800/50">
                  <Link 
                    to="/profile"
                    className="py-2.5 flex items-center justify-center gap-2 text-slate-500 hover:text-white hover:bg-slate-900 transition-colors border-r border-slate-800/50"
                  >
                    <UserCircle size={14} />
                    <span className="text-[9px] font-bold uppercase">{t.profile}</span>
                  </Link>
                  <button onClick={logout} className="py-2.5 flex items-center justify-center gap-2 text-slate-500 hover:text-red-500 hover:bg-slate-900 transition-colors">
                    <LogOut size={14} />
                    <span className="text-[9px] font-bold uppercase">{t.logout}</span>
                  </button>
                </div>
              </div>
            )}

            <button 
              onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all border border-transparent hover:border-slate-700"
            >
              <Languages size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">{language === 'en' ? 'Switch to Chinese' : '切换至英文'}</span>
            </button>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.serverStatus}</span>
              </div>
              <p className="text-[10px] text-slate-600 font-medium">{t.operational}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative bg-slate-950 overflow-auto min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
