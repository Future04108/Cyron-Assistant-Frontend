import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Login } from './routes/Login';
import { AuthCallback } from './routes/AuthCallback';
import { Dashboard } from './routes/Dashboard';
import { Knowledge } from './routes/Knowledge';
import { Usage } from './routes/Usage';
import { Settings } from './routes/Settings';
import { NotFound } from './routes/NotFound';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/guilds/:guildId" element={<Dashboard />} />
            <Route path="/guilds/:guildId/knowledge" element={<Knowledge />} />
            <Route path="/guilds/:guildId/usage" element={<Usage />} />
            <Route path="/guilds/:guildId/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

