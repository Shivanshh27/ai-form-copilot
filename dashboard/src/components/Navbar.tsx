import React from 'react';
import { Profile } from '../types';
import { UserCheck, ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  profiles: Profile[];
  selectedProfile: Profile | null;
  onSelectProfile: (profile: Profile) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ profiles, selectedProfile, onSelectProfile }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="h-16 glass-panel border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold text-slate-300">Active Extension Profile:</h2>
        
        {/* Profile Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-sm font-medium text-slate-200 transition-colors"
          >
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>{selectedProfile?.title || 'Select Profile'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-2 w-64 glass-panel bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Profile
              </div>
              {profiles.map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => {
                    onSelectProfile(prof);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                    selectedProfile?.id === prof.id
                      ? 'bg-blue-600/20 text-blue-400 font-medium'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-medium truncate">{prof.title}</div>
                    <div className="text-[11px] text-slate-400 truncate">{prof.designation || prof.college || 'General Profile'}</div>
                  </div>
                  {selectedProfile?.id === prof.id && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Connection & User Indicator */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          FastAPI Engine Online
        </div>

        <div className="flex items-center gap-2 pl-4 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-semibold text-xs text-white shadow-md">
            AM
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-200">Alex Morgan</div>
            <div className="text-[10px] text-slate-400">Pro Plan</div>
          </div>
        </div>
      </div>
    </header>
  );
};
