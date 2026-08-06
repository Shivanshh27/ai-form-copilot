import React from 'react';
import { AnalyticsSummary, Profile } from '../types';
import { Zap, Clock, CheckCircle, Brain, ArrowUpRight, ShieldCheck, Sparkles, Building, Layers } from 'lucide-react';

interface OverviewProps {
  analytics: AnalyticsSummary | null;
  activeProfile: Profile | null;
}

export const Overview: React.FC<OverviewProps> = ({ analytics, activeProfile }) => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl glass-card border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Ready to Autofill Forms
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back, Alex</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Your active profile is <span className="text-blue-400 font-semibold">{activeProfile?.title || 'Default Profile'}</span>.
              The Chrome Extension will automatically scan and autofill forms on Greenhouse, Lever, Workday, and custom websites.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-xs text-slate-400">Shortcut</div>
              <div className="text-sm font-mono font-bold text-blue-400 mt-0.5">Ctrl + Shift + F</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl glass-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Forms Filled</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{analytics?.forms_filled || 24}</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18% this week
          </div>
        </div>

        <div className="p-5 rounded-xl glass-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Fields Matched</span>
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{analytics?.fields_filled || 284}</div>
          <div className="text-xs text-slate-400">
            Rule-based & AI smart mapping
          </div>
        </div>

        <div className="p-5 rounded-xl glass-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Time Saved</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{analytics?.time_saved_minutes || 71} mins</div>
          <div className="text-xs text-purple-400">
            ~3 mins per application
          </div>
        </div>

        <div className="p-5 rounded-xl glass-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Learned Mappings</span>
            <Brain className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{analytics?.learned_mappings_count || 8}</div>
          <div className="text-xs text-amber-400">
            Custom user corrections
          </div>
        </div>
      </div>

      {/* Active Profile Snapshot & Supported Platforms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" /> Active Profile Details
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Default
            </span>
          </div>
          
          <div className="space-y-3 pt-2 text-sm border-t border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Name</span>
              <span className="font-medium text-slate-200">{activeProfile?.full_name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Role</span>
              <span className="font-medium text-slate-200">{activeProfile?.designation || 'Software Engineer'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Company</span>
              <span className="font-medium text-slate-200">{activeProfile?.company || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Education</span>
              <span className="font-medium text-slate-200">{activeProfile?.college || 'N/A'}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-400 mb-2">Skills ({activeProfile?.skills.length || 0})</div>
            <div className="flex flex-wrap gap-1.5">
              {activeProfile?.skills.map((skill, idx) => (
                <span key={idx} className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Supported Platforms */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
            <Building className="w-4 h-4 text-purple-400" /> Supported Job Platforms & Forms
          </h3>
          <p className="text-xs text-slate-400">
            AI Form Copilot instantly detects field inputs, select dropdowns, radio options, and textareas across top platforms.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {['Greenhouse', 'Lever', 'Workday', 'Ashby', 'Typeform', 'Google Forms', 'Startup Portals', 'College Forms', 'Custom HTML Forms'].map((platform, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-xs font-medium text-slate-300">{platform}</span>
              </div>
            ))}
          </div>

          {/* Activity Feed */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent Autofill Activity</h4>
            <div className="space-y-2">
              {analytics?.recent_activity.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 border border-slate-800 text-xs">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-semibold text-slate-200">{item.domain}</span>
                      <span className="text-slate-400 ml-2">({item.fields} fields filled)</span>
                    </div>
                  </div>
                  <span className="text-slate-400 font-mono">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
