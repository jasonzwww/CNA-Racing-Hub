
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Standings from './pages/Standings';
import Archives from './pages/Archives';
import Drivers from './pages/Drivers';
import WorldMap from './pages/WorldMap';
import EnduranceMatchmaking from './pages/EnduranceMatchmaking';
import AISteward from './pages/AISteward';
import Management from './pages/Management';
import Profile from './pages/Profile';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/archives" element={<Archives />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/map" element={<WorldMap />} />
              <Route path="/matchmaking" element={<EnduranceMatchmaking />} />
              <Route path="/ai-steward" element={<AISteward />} />
              <Route path="/management" element={<Management />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
