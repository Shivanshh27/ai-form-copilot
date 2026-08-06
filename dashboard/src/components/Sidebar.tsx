import React from 'react';
import { LayoutDashboard, UserCheck, FileText, Sparkles, SlidersHorizontal, Settings, ShieldCheck, Zap } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profiles', label: 'Profiles', icon: UserCheck },
    { id: 'resume', label: 'Resume Center', icon: FileText },
    { id: 'answers', label: 'AI Answers Vault', icon: Sparkles },
    { id: 'mappings', label: 'Learned Mappings', icon: SlidersHorizontal },
    { id: 'settings', label: 'Settings & API Keys', icon: Settings },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-30">
      <div>
        {/* Brand Header */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-800/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 tracking-tight text-base flex items-center gap-1.5">
              AI Form Copilot
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">v1.0</span>
            </h1>
            <p className="text-xs text-slate-400">Save once, fill anywhere</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Chrome Extension Status Footer */}
      <div className="p-4 m-3 rounded-xl glass-card border border-blue-500/20 bg-blue-950/20">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400">Extension Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
          Chrome Extension is connected and listening for form DOM triggers.
        </p>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
          <span>Shortcut</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Ctrl + Shift + F</kbd>
        </div>
      </div>
    </aside>
  );
};
