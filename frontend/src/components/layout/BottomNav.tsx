import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Calendar, ClipboardList, Settings } from 'lucide-react';

const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/students', icon: Users, label: 'Students' },
    { to: '/schedule', icon: Calendar, label: 'Schedule' },
    { to: '/sessions', icon: ClipboardList, label: 'Sessions' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav
      style={{ backgroundColor: 'rgba(26, 16, 40, 0.95)', backdropFilter: 'blur(20px)' }}
      className="fixed bottom-0 left-0 right-0 border-t border-white/10 px-2 py-1 flex justify-around items-center z-50 safe-area-inset"
    >
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `
            flex flex-col items-center justify-center flex-1 py-2 transition-all rounded-xl mx-0.5
            ${isActive ? 'text-brand-gold' : 'text-brand-darkMuted hover:text-white'}
          `}
        >
          <Icon className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium tracking-wide uppercase">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
