import React, { useState } from 'react';
import { Zap, UserCheck, Settings, Sparkles, CheckCircle2, Copy, ExternalLink, ShieldCheck, ChevronDown } from 'lucide-react';

export const Popup: React.FC = () => {
  const [activeProfile, setActiveProfile] = useState("Software Engineer (Default)");
  const [statusMsg, setStatusMsg] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const profiles = [
    "Software Engineer (Default)",
    "Product Manager & Founder",
    "MBA Candidate",
    "Freelance Consultant"
  ];

  const quickAnswers = [
    { id: 1, title: "Tell us about yourself", text: "I am a dedicated full-stack software engineer with expertise in FastAPI, React, and high-performance algorithms." },
    { id: 2, title: "Why should we hire you", text: "I bring a strong engineering background, fast execution speed, and deep technical commitment to building high quality products." }
  ];

  const handleFillForm = () => {
    setStatusMsg("Autofilling active tab form...");
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "TRIGGER_AUTOFILL" });
      }
    });
    setTimeout(() => setStatusMsg("Form autofilled!"), 2000);
  };

  const handleCopyText = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openDashboard = () => {
    chrome.tabs?.create({ url: "http://localhost:3000" });
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', background: '#090d16' }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap style={{ width: '18px', height: '18px', color: '#ffffff' }} />
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#f8fafc', letterSpacing: '-0.02em' }}>AI Form Copilot</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>v1.0 Chrome Extension</div>
          </div>
        </div>

        <button onClick={openDashboard} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '6px', color: '#cbd5e1', cursor: 'pointer' }} title="Open Web Dashboard">
          <ExternalLink style={{ width: '14px', height: '14px' }} />
        </button>
      </div>

      {/* Profile Selector */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '10px' }}>
        <div style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Active Profile</div>
        <select
          value={activeProfile}
          onChange={(e) => setActiveProfile(e.target.value)}
          style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', padding: '8px', fontSize: '12px', fontWeight: '500', outline: 'none' }}
        >
          {profiles.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={handleFillForm}
          style={{
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '12px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
          }}
        >
          <Zap style={{ width: '16px', height: '16px' }} />
          Fill Form Now (Ctrl+Shift+F)
        </button>

        {statusMsg && (
          <div style={{ fontSize: '11px', color: '#34d399', textAlign: 'center', fontWeight: '500' }}>
            {statusMsg}
          </div>
        )}
      </div>

      {/* Quick Answers Bank */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles style={{ width: '12px', height: '12px', color: '#c084fc' }} />
          Quick Reusable Answers
        </div>

        {quickAnswers.map((ans) => (
          <div key={ans.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px', fontSize: '11px' }}>
            <div style={{ fontWeight: '600', color: '#f8fafc', marginBottom: '4px' }}>{ans.title}</div>
            <div style={{ color: '#94a3b8', fontSize: '10px', lineHeight: '1.4', marginBottom: '6px' }}>{ans.text}</div>
            <button
              onClick={() => handleCopyText(ans.id, ans.text)}
              style={{ background: '#334155', border: 'none', borderRadius: '6px', color: '#f8fafc', padding: '4px 8px', fontSize: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {copiedId === ans.id ? <CheckCircle2 style={{ width: '10px', height: '10px', color: '#34d399' }} /> : <Copy style={{ width: '10px', height: '10px', color: '#c084fc' }} />}
              {copiedId === ans.id ? 'Copied!' : 'Copy Answer'}
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', fontSize: '10px', color: '#64748b', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399' }}>
          <ShieldCheck style={{ width: '12px', height: '12px' }} /> Engine Connected
        </div>
        <div style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={openDashboard}>
          Open Dashboard →
        </div>
      </div>
    </div>
  );
};
