import React, { useState } from 'react';
import { AISetting } from '../types';
import { Settings as SettingsIcon, Key, Save, CheckCircle2, Shield, Eye, EyeOff } from 'lucide-react';
import { updateSettings } from '../services/api';

interface SettingsProps {
  settings: AISetting;
  onSaveSettings: (settings: AISetting) => Promise<void>;
}

export const Settings: React.FC<SettingsProps> = ({ settings: initialSettings, onSaveSettings }) => {
  const [formData, setFormData] = useState<AISetting>(initialSettings);
  const [showKeys, setShowKeys] = useState({ openai: false, claude: false, gemini: false });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-blue-400" /> Settings & API Keys
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure external LLM API providers (OpenAI, Claude, Gemini) and manage autofill engine behavior.
        </p>
      </div>

      {isSaved && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Settings and encrypted API keys saved!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* API Keys Card */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-400" /> Encrypted LLM Provider API Keys
            </h3>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <Shield className="w-3.5 h-3.5" /> AES Encrypted
            </span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">OpenAI API Key (GPT-4o Mini / GPT-4o)</label>
              <div className="relative">
                <input
                  type={showKeys.openai ? "text" : "password"}
                  value={formData.openai_api_key || ''}
                  onChange={(e) => setFormData({ ...formData, openai_api_key: e.target.value })}
                  placeholder="sk-proj-..."
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKeys({ ...showKeys, openai: !showKeys.openai })}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showKeys.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Claude API Key (Anthropic)</label>
              <div className="relative">
                <input
                  type={showKeys.claude ? "text" : "password"}
                  value={formData.claude_api_key || ''}
                  onChange={(e) => setFormData({ ...formData, claude_api_key: e.target.value })}
                  placeholder="sk-ant-..."
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKeys({ ...showKeys, claude: !showKeys.claude })}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showKeys.claude ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Gemini API Key (Google)</label>
              <div className="relative">
                <input
                  type={showKeys.gemini ? "text" : "password"}
                  value={formData.gemini_api_key || ''}
                  onChange={(e) => setFormData({ ...formData, gemini_api_key: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKeys({ ...showKeys, gemini: !showKeys.gemini })}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showKeys.gemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Toggles Card */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <h3 className="font-semibold text-slate-200 text-sm">Autofill Engine Feature Toggles</h3>

          <div className="space-y-3 pt-2">
            {[
              { key: 'enable_ai_filling', label: 'Enable AI-Powered Form Filling', desc: 'Allows long essay answers and complex inputs to be answered using LLM AI.' },
              { key: 'enable_smart_mapping', label: 'Enable Smart Semantic Mapping', desc: 'Uses LLM semantic matching when DOM label confidence is low.' },
              { key: 'auto_save_answers', label: 'Auto-Save User Field Corrections', desc: 'Prompts to store modified form fields into learned custom mappings.' },
              { key: 'auto_upload_resume', label: 'Auto-Detect Resume File Inputs', desc: 'Automatically fills file inputs with active PDF resume link.' },
            ].map((toggle) => (
              <label key={toggle.key} className="flex items-start justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-slate-200">{toggle.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{toggle.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={(formData as any)[toggle.key]}
                  onChange={(e) => setFormData({ ...formData, [toggle.key]: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 mt-1"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
