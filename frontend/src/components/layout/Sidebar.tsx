import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Calendar, ClipboardList, Settings, Music } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/students', icon: Users, label: 'Students' },
    { to: '/schedule', icon: Calendar, label: 'Calendar' },
    { to: '/sessions', icon: ClipboardList, label: 'Sessions' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 h-screen bg-brand-surface border-r border-white/5 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center shadow-lg shadow-brand-gold/20">
            <Music className="text-brand-bg w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-semibold text-brand-goldLight tracking-tight">Violin Tracker</h1>
            <p className="text-[10px] uppercase font-black text-brand-darkMuted tracking-[0.2em]">Management</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-brand-gold/10 text-brand-gold' 
                  : 'text-brand-muted hover:bg-white/5 hover:text-white'}
              `}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${label === 'Dashboard' ? '' : ''}`} />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-gold/10 to-transparent border border-brand-gold/10">
          <p className="text-xs text-brand-gold font-medium mb-1">Support</p>
          <p className="text-[10px] text-brand-darkMuted leading-relaxed">
            Manage your violin studio with elegance and precision.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
