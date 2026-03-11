import { Outlet, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { GuildSubnav } from './GuildSubnav';
import { GuildList } from '../GuildList';
import { api } from '../../lib/api';

interface Guild {
  id: string;
  name: string;
  plan?: 'free' | 'pro' | 'business' | string;
}

async function fetchGuilds(): Promise<Guild[]> {
  const res = await api.get<Guild[]>('/guilds');
  return res.data;
}

export const AppLayout = () => {
  const params = useParams<{ guildId?: string }>();
  const { data: guilds } = useQuery({
    queryKey: ['guilds'],
    queryFn: fetchGuilds,
  });

  const selectedGuild =
    guilds?.find((g) => String(g.id) === params.guildId) ?? null;

  return (
    <div className="flex min-h-screen bg-bg-base">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopNav currentGuildName={selectedGuild?.name} />
        <GuildSubnav />
        {/* Mobile sidebar */}
        <div className="border-b border-slate-200 bg-white/80 px-4 py-2 backdrop-blur-lg md:hidden">
          <GuildList />
        </div>
        <main className="flex-1 px-6 pb-8 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mx-auto max-w-6xl"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

