import React, { useState } from 'react';
import { Profile } from '../types';
import { UserCheck, Plus, Save, Trash2, Check, X, Sparkles, Briefcase, GraduationCap, Link as LinkIcon, MapPin, Code2 } from 'lucide-react';

interface ProfilesProps {
  profiles: Profile[];
  activeProfile: Profile | null;
  onSaveProfile: (profile: Profile) => Promise<void>;
  onCreateProfile: (title: string) => Promise<void>;
}

export const Profiles: React.FC<ProfilesProps> = ({ profiles, activeProfile, onSaveProfile, onCreateProfile }) => {
  const [formData, setFormData] = useState<Profile | null>(activeProfile);
  const [activeTab, setActiveTab] = useState<'personal' | 'address' | 'professional' | 'education' | 'links' | 'skills' | 'projects'>('personal');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newProfileTitle, setNewProfileTitle] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSavedToast, setIsSavedToast] = useState(false);

  React.useEffect(() => {
    setFormData(activeProfile);
  }, [activeProfile]);

  if (!formData) return null;

  const handleChange = (field: keyof Profile, value: any) => {
    setFormData((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    const updated = [...(formData.skills || []), newSkillInput.trim()];
    handleChange('skills', updated);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = (formData.skills || []).filter((s) => s !== skillToRemove);
    handleChange('skills', updated);
  };

  const handleSave = async () => {
    if (formData) {
      await onSaveProfile(formData);
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 3000);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfileTitle.trim()) {
      await onCreateProfile(newProfileTitle.trim());
      setNewProfileTitle('');
      setShowCreateModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-400" /> Manage Profiles
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create profiles tailored for Software Engineering, Product Management, MBA, or Freelance applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Plus className="w-4 h-4 text-blue-400" /> New Profile
          </button>
          
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      {isSavedToast && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" /> Profile saved successfully! Chrome extension automatically updated.
          </span>
        </div>
      )}

      {/* Main Profile Editor Card */}
      <div className="glass-card border border-slate-800 rounded-2xl overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-900/80 border-b border-slate-800 overflow-x-auto">
          {[
            { id: 'personal', label: 'Personal Info', icon: UserCheck },
            { id: 'address', label: 'Address', icon: MapPin },
            { id: 'professional', label: 'Professional', icon: Briefcase },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'links', label: 'Links & Portfolio', icon: LinkIcon },
            { id: 'skills', label: 'Skills & Tech', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Profile Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name || ''}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="Alex Morgan"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="alex.morgan@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Phone / Contact Number</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="+1 (555) 234-5678"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob || ''}
                  onChange={(e) => handleChange('dob', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Gender</label>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Street Address</label>
                <input
                  type="text"
                  value={formData.street || ''}
                  onChange={(e) => handleChange('street', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="742 Evergreen Terrace"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">City</label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="San Francisco"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">State / Region</label>
                <input
                  type="text"
                  value={formData.state || ''}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="California"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Country</label>
                <input
                  type="text"
                  value={formData.country || ''}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="United States"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Zipcode / Pincode</label>
                <input
                  type="text"
                  value={formData.pincode || ''}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="94107"
                />
              </div>
            </div>
          )}

          {activeTab === 'professional' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Company / Organization</label>
                <input
                  type="text"
                  value={formData.company || ''}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="Apex Tech Labs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Designation / Current Role</label>
                <input
                  type="text"
                  value={formData.designation || ''}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Years of Experience</label>
                <input
                  type="text"
                  value={formData.experience || ''}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="4 Years"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Notice Period</label>
                <input
                  type="text"
                  value={formData.notice_period || ''}
                  onChange={(e) => handleChange('notice_period', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="Immediate / 15 Days"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Salary / CTC</label>
                <input
                  type="text"
                  value={formData.current_salary || ''}
                  onChange={(e) => handleChange('current_salary', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="$140,000 / year"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Expected Salary / CTC</label>
                <input
                  type="text"
                  value={formData.expected_salary || ''}
                  onChange={(e) => handleChange('expected_salary', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="$165,000 / year"
                />
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">College / University Name</label>
                <input
                  type="text"
                  value={formData.college || ''}
                  onChange={(e) => handleChange('college', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="Stanford University"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Degree</label>
                <input
                  type="text"
                  value={formData.degree || ''}
                  onChange={(e) => handleChange('degree', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="Bachelor of Science"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Branch / Field of Study</label>
                <input
                  type="text"
                  value={formData.branch || ''}
                  onChange={(e) => handleChange('branch', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="Computer Science"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">CGPA / GPA Score</label>
                <input
                  type="text"
                  value={formData.cgpa || ''}
                  onChange={(e) => handleChange('cgpa', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="3.85 / 4.0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Graduation Year</label>
                <input
                  type="text"
                  value={formData.graduation_year || ''}
                  onChange={(e) => handleChange('graduation_year', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="2021"
                />
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={formData.linkedin || ''}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="https://linkedin.com/in/alexmorgan-dev"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">GitHub Profile URL</label>
                <input
                  type="text"
                  value={formData.github || ''}
                  onChange={(e) => handleChange('github', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="https://github.com/alexmorgan-dev"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Portfolio / Website URL</label>
                <input
                  type="text"
                  value={formData.portfolio || ''}
                  onChange={(e) => handleChange('portfolio', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="https://alexmorgan.dev"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Resume File URL</label>
                <input
                  type="text"
                  value={formData.resume_url || ''}
                  onChange={(e) => handleChange('resume_url', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="https://alexmorgan.dev/resume.pdf"
                />
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Technical Skills Chips</label>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500 w-72"
                    placeholder="Add skill (e.g. Next.js, Docker)"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
                  >
                    Add Chip
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800 min-h-[100px]">
                  {formData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-300 text-xs font-semibold"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-red-400 text-slate-400 ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for creating a new profile */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create New Profile</h3>
            <p className="text-xs text-slate-400">
              Profiles let you switch between different field configurations when applying for roles.
            </p>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Profile Name / Category</label>
                <input
                  type="text"
                  required
                  value={newProfileTitle}
                  onChange={(e) => setNewProfileTitle(e.target.value)}
                  placeholder="e.g. Product Manager, MBA, Freelancer"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
