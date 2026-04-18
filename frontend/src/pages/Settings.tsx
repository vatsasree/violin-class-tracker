import React from 'react';
import { useLayout } from '../context/LayoutContext';
import { 
  Settings as SettingsIcon, Layout as LayoutIcon, 
  Sidebar as SidebarIcon, Smartphone, Moon, 
  ChevronRight, ShieldCheck, Globe
} from 'lucide-react';

const Settings: React.FC = () => {
  const { navigationStyle, setNavigationStyle } = useLayout();

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif font-bold text-white mb-2 tracking-tight">System Settings</h1>
        <p className="text-brand-muted font-medium flex items-center">
          <SettingsIcon className="w-4 h-4 mr-2 text-brand-gold" />
          Customize your violin studio experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left: Section Selection */}
        <div className="md:col-span-1 space-y-2">
           <button className="w-full flex items-center justify-between p-4 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-2xl transition-all">
             <div className="flex items-center space-x-3">
               <LayoutIcon className="w-5 h-5" />
               <span className="font-bold">Display & View</span>
             </div>
             <ChevronRight className="w-4 h-4" />
           </button>
           <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 text-brand-muted rounded-2xl transition-all">
             <div className="flex items-center space-x-3">
               <Globe className="w-5 h-5" />
               <span className="font-medium">Localization</span>
             </div>
             <ChevronRight className="w-4 h-4" />
           </button>
           <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 text-brand-muted rounded-2xl transition-all">
             <div className="flex items-center space-x-3">
               <ShieldCheck className="w-5 h-5" />
               <span className="font-medium">Privacy</span>
             </div>
             <ChevronRight className="w-4 h-4" />
           </button>
        </div>

        {/* Right: Section Content */}
        <div className="md:col-span-2 space-y-8">
           <section className="space-y-6">
             <h3 className="text-xs font-black text-brand-darkMuted uppercase tracking-widest flex items-center">
               Navigation Style
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {/* Sidebar Option */}
               <button 
                 onClick={() => setNavigationStyle('sidebar')}
                 className={`relative overflow-hidden p-6 rounded-[2rem] border-2 transition-all text-left ${
                   navigationStyle === 'sidebar' 
                   ? 'bg-brand-gold/10 border-brand-gold ring-4 ring-brand-gold/5' 
                   : 'bg-brand-surface border-white/5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:border-white/20'
                 }`}
               >
                 <div className="flex items-center justify-between mb-8">
                   <div className="p-3 bg-brand-surfaceLight rounded-2xl">
                     <SidebarIcon className="w-6 h-6 text-brand-gold" />
                   </div>
                   {navigationStyle === 'sidebar' && (
                     <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center">
                       <ShieldCheck className="w-4 h-4 text-brand-bg" />
                     </div>
                   )}
                 </div>
                 <h4 className="text-lg font-serif font-bold text-white mb-1">Standard Sidebar</h4>
                 <p className="text-xs text-brand-darkMuted leading-relaxed">
                   Best for desktop use. Keep all tools accessible on the left side.
                 </p>
               </button>

               {/* Bottom Nav Option */}
               <button 
                 onClick={() => setNavigationStyle('bottom-nav')}
                 className={`relative overflow-hidden p-6 rounded-[2rem] border-2 transition-all text-left ${
                   navigationStyle === 'bottom-nav' 
                   ? 'bg-brand-gold/10 border-brand-gold ring-4 ring-brand-gold/5' 
                   : 'bg-brand-surface border-white/5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:border-white/20'
                 }`}
               >
                 <div className="flex items-center justify-between mb-8">
                   <div className="p-3 bg-brand-surfaceLight rounded-2xl">
                     <Smartphone className="w-6 h-6 text-brand-gold" />
                   </div>
                   {navigationStyle === 'bottom-nav' && (
                     <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center">
                       <ShieldCheck className="w-4 h-4 text-brand-bg" />
                     </div>
                   )}
                 </div>
                 <h4 className="text-lg font-serif font-bold text-white mb-1">Compact Bottom</h4>
                 <p className="text-xs text-brand-darkMuted leading-relaxed">
                   Optimized for touch. Maximizes horizontal space for class focus.
                 </p>
               </button>
             </div>
           </section>

           <section className="space-y-4">
             <h3 className="text-xs font-black text-brand-darkMuted uppercase tracking-widest flex items-center">
               Theme Strategy
             </h3>
             <div className="card bg-brand-surfaceLight/50 p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                    <Moon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Midnight Violet (OLED)</h4>
                    <p className="text-[11px] text-brand-darkMuted">Default studio theme for focused sessions</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase rounded-lg border border-indigo-500/10">Active</span>
             </div>
           </section>

           <div className="pt-10 border-t border-white/5 flex items-center justify-center space-x-10">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-brand-darkMuted uppercase tracking-widest mb-2">Version</span>
                <span className="text-xs font-bold text-brand-gold">4.0.0-PREMIUM</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-brand-darkMuted uppercase tracking-widest mb-2">Platform</span>
                <span className="text-xs font-bold text-white uppercase italic">Violin Tracker</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
