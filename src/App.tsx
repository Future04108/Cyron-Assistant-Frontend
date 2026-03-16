import { Routes, Route } from 'react-router-dom';
import { AuthCallback } from './routes/AuthCallback';
import { Dashboard } from './routes/dashboard';
import { Settings } from './routes/settings';
import { Premium } from './routes/premium';
import { Payment } from './routes/payment';
import { NotFound } from './routes/NotFound';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { Home } from './routes/home';

export default function App() {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/guilds/:guildId" element={<Settings />} />
          <Route path="/guilds/:guildId/settings" element={<Settings />} />
          <Route
            path="/guilds/:guildId/embed-customization"
            element={<Settings />}
          />
          <Route
            path="/guilds/:guildId/usage-analytics"
            element={<Settings />}
          />
          <Route path="/guilds/:guildId/knowledge" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

