
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ClientLayout from './components/ClientLayout';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Standings from './pages/Standings';
import Archives from './pages/Archives';
import Drivers from './pages/Drivers';
import WorldMap from './pages/WorldMap';
import EnduranceMatchmaking from './pages/EnduranceMatchmaking';
import Management from './pages/Management';
import Profile from './pages/Profile';
import AISteward from './pages/AISteward';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <HashRouter>
          <ClientLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/archives" element={<Archives />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/map" element={<WorldMap />} />
              <Route path="/matchmaking" element={<EnduranceMatchmaking />} />
              <Route path="/management" element={<Management />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/ai-steward" element={<AISteward />} />
            </Routes>
          </ClientLayout>
        </HashRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
