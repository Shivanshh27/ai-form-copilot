import React, { useState } from 'react';
import { SavedMapping } from '../types';
import { SlidersHorizontal, Trash2, CheckCircle2, Brain, Sparkles } from 'lucide-react';

export const Mappings: React.FC = () => {
  const [mappings, setMappings] = useState<SavedMapping[]>([
    { id: 1, field_identifier: 'custom_salary_expected', field_label: 'Expected CTC / Salary', mapped_profile_key: 'expected_salary', custom_value: '$165,000 / year', usage_count: 5, updated_at: '2026-08-06' },
    { id: 2, field_identifier: 'github_portfolio_url', field_label: 'GitHub or Online Work Link', mapped_profile_key: 'github', custom_value: 'https://github.com/alexmorgan-dev', usage_count: 12, updated_at: '2026-08-05' },
    { id: 3, field_identifier: 'work_authorization_status', field_label: 'Are you authorized to work in the US?', mapped_profile_key: 'custom_override', custom_value: 'Yes, authorized without sponsorship', usage_count: 8, updated_at: '2026-08-04' }
  ]);

  const handleDelete = (id: number) => {
    setMappings(mappings.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-amber-400" /> Learned Field Mappings & Corrections
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          When you edit or correct an autofilled field inside the Chrome extension, the system learns your preference for future forms.
        </p>
      </div>

      <div className="glass-card border border-slate-800 rounded-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-amber-400" /> Active Custom Mappings ({mappings.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">Updated dynamically in background</span>
        </div>

        <div className="space-y-3">
          {mappings.map((mapping) => (
            <div key={mapping.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-100">{mapping.field_label}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono">
                    Used {mapping.usage_count} times
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  DOM Identifier: <span className="text-slate-300">{mapping.field_identifier}</span>
                </div>
                <div className="text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 inline-block">
                  Mapped Value: <span className="text-blue-400 font-semibold">{mapping.custom_value || mapping.mapped_profile_key}</span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(mapping.id)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
                title="Delete Mapping"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
