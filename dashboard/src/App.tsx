import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Overview } from './pages/Overview';
import { Profiles } from './pages/Profiles';
import { Resume } from './pages/Resume';
import { Answers } from './pages/Answers';
import { Mappings } from './pages/Mappings';
import { Settings } from './pages/Settings';
import { Profile, AnalyticsSummary, CustomAnswer, AISetting } from './types';
import { getProfiles, updateProfile, createProfile, getAnalyticsSummary, getAnswers, getSettings, updateSettings } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [answers, setAnswers] = useState<CustomAnswer[]>([]);
  const [settings, setSettingsData] = useState<AISetting>({
    enable_ai_filling: true,
    enable_smart_mapping: true,
    auto_save_answers: true,
    auto_upload_resume: true
  });

  useEffect(() => {
    async function loadData() {
      const profs = await getProfiles();
      setProfiles(profs);
      const defaultProf = profs.find(p => p.is_default) || profs[0] || null;
      setActiveProfile(defaultProf);

      const stats = await getAnalyticsSummary();
      setAnalytics(stats);

      const ansList = await getAnswers();
      setAnswers(ansList);

      const aiSet = await getSettings();
      setSettingsData(aiSet);
    }
    loadData();
  }, []);

  const handleSaveProfile = async (updated: Profile) => {
    const saved = await updateProfile(updated.id, updated);
    setProfiles(profiles.map(p => p.id === saved.id ? saved : p));
    if (activeProfile?.id === saved.id) {
      setActiveProfile(saved);
    }
  };

  const handleCreateProfile = async (title: string) => {
    const newProf = await createProfile({ title });
    setProfiles([...profiles, newProf]);
    setActiveProfile(newProf);
  };

  const handleSaveSettings = async (updated: AISetting) => {
    const saved = await updateSettings(updated);
    setSettingsData(saved);
  };

  return (
    <div className="flex min-h-screen bg-[#090d16] text-slate-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          profiles={profiles}
          selectedProfile={activeProfile}
          onSelectProfile={(p) => setActiveProfile(p)}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'overview' && (
            <Overview analytics={analytics} activeProfile={activeProfile} />
          )}

          {activeTab === 'profiles' && (
            <Profiles
              profiles={profiles}
              activeProfile={activeProfile}
              onSaveProfile={handleSaveProfile}
              onCreateProfile={handleCreateProfile}
            />
          )}

          {activeTab === 'resume' && (
            <Resume
              activeProfile={activeProfile}
              onSyncProfile={handleSaveProfile}
            />
          )}

          {activeTab === 'answers' && (
            <Answers answers={answers} />
          )}

          {activeTab === 'mappings' && (
            <Mappings />
          )}

          {activeTab === 'settings' && (
            <Settings settings={settings} onSaveSettings={handleSaveSettings} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
