import { GuildList } from '../GuildList';

export const Sidebar = () => (
  <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white/80 backdrop-blur-lg md:flex" style={{width: '20rem'}}>
    <GuildList />
  </aside>
);

