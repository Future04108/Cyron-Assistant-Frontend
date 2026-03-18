import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const AuthCallback = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = query.get('code');
    const state = query.get('state');

    if (!code || !state) {
      // If callback params are missing, send the user to home instead of a
      // non-existent /login page (prevents a brief 404 flash on Vercel).
      navigate('/?error=missing_code', { replace: true });
      return;
    }

    const doExchange = async () => {
      try {
        const res = await api.post<{ token: string; redirect: string }>('/auth/callback', null, {
          params: { code, state },
        });
        const { token, redirect } = res.data;
        if (!token) {
          throw new Error('Missing token in callback response');
        }
        setAuthToken(token);
        navigate(redirect || '/', { replace: true });
      } catch (e: any) {
        const msg =
          e?.response?.data?.detail ||
          e?.message ||
          'Failed to complete Discord login. Please try again.';
        setError(msg);
        // On error, also redirect to home with an error flag rather than /login
        // to avoid hitting a missing route in the hosted marketing shell.
        navigate(`/?error=${encodeURIComponent('oauth_failed')}`, {
          replace: true,
        });
      }
    };

    void doExchange();
  }, [navigate, query, setAuthToken]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="rounded-2xl bg-white px-6 py-5 shadow-soft"
      >
        <p className="text-sm text-text-muted">
          {error ? 'Login failed. Redirecting…' : 'Finishing sign-in with Discord...'}
        </p>
      </motion.div>
    </div>
  );
};

