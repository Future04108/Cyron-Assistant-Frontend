import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { api } from '../../lib/api';
import { FaServer } from 'react-icons/fa';
import { DashboardHeaderSection } from './HeaderSection';
import { DashboardFiltersSection } from './FiltersSection';
import { DashboardEmptyState } from './EmptyState';
import { DashboardGuildGrid } from './GuildGrid';

async function fetchGuilds(): Promise<Guild[]> {
  const res = await api.get<Guild[]>('/guilds');
  return res.data;
}

const BOT_INVITE_BASE_URL =
  import.meta.env.VITE_DISCORD_BOT_INVITE_URL ??
  'https://discord.com/oauth2/authorize?client_id=1473403672086970459&permissions=8&integration_type=0&scope=applications.commands+bot';

export const Dashboard = () => {
  const params = useParams<{ guildId?: string }>();
  const { data: guilds, isLoading, isError } = useQuery({
    queryKey: ['guilds'],
    queryFn: fetchGuilds,
  });

  const selectedGuild =
    guilds?.find((g) => String(g.id) === params.guildId) ?? null;

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'installed' | 'uninstalled'>('all');

  const stats = useMemo(() => {
    const total = guilds?.length ?? 0;
    const botInstalled = guilds?.filter((g) => !!g.has_bot).length ?? 0;
    return { total, botInstalled };
  }, [guilds]);

  const filteredGuilds = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = guilds ?? [];
    return list.filter((g) => {
      const matchesQuery = !q || g.name.toLowerCase().includes(q);
      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'installed'
            ? !!g.has_bot
            : !g.has_bot;
      return matchesQuery && matchesFilter;
    });
  }, [guilds, query, filter]);

  const handleAddBot = (guildId: string | number) => {
    const url = `${BOT_INVITE_BASE_URL}&guild_id=${String(
      guildId,
    )}&disable_guild_select=true`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-8"
    >
      <DashboardHeaderSection
        selectedGuild={selectedGuild}
        stats={stats}
        isLoading={isLoading}
        onAddBot={handleAddBot}
      />

      <DashboardFiltersSection
        query={query}
        filter={filter}
        onQueryChange={setQuery}
        onFilterChange={setFilter}
        onReset={() => {
          setQuery('');
          setFilter('all');
        }}
      />

      {isLoading && (
        <p className="text-sm text-slate-600 flex items-center gap-2">
          <FaServer className="text-slate-400" />
          Loading your servers…
        </p>
      )}

      {isError && !isLoading && (
        <p className="text-sm text-red-600 flex items-center gap-2">
          <FaServer className="text-red-400" />
          Failed to load servers. Please refresh the page.
        </p>
      )}

      {!isLoading && !isError && filteredGuilds.length === 0 && (
        <DashboardEmptyState />
      )}

      {!isLoading && !isError && filteredGuilds.length > 0 && (
        <DashboardGuildGrid
          guilds={filteredGuilds}
          activeGuildId={params.guildId}
          onAddBot={handleAddBot}
        />
      )}
    </motion.section>
  );
};
