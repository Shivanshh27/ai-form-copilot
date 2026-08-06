// Chrome Extension Background Service Worker (Manifest V3)

const API_BASE = "http://localhost:8000/api/v1";

chrome.runtime.onInstalled.addListener(() => {
  console.log("AI Form Copilot Service Worker Installed");
  // Set default initial extension storage
  chrome.storage.local.set({
    activeProfileId: 1,
    extensionEnabled: true,
    backendStatus: "online"
  });
});

// Listen to keyboard shortcut (Ctrl+Shift+F)
chrome.commands.onCommand.addListener((command) => {
  if (command === "trigger_autofill") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "TRIGGER_AUTOFILL" });
      }
    });
  }
});

// Handle incoming messages from Content Script or Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SCAN_AND_AUTOFILL") {
    handleAutofillScan(request.payload)
      .then((data) => sendResponse({ success: true, data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }

  if (request.action === "SAVE_FIELD_CORRECTION") {
    handleSaveCorrection(request.payload)
      .then((data) => sendResponse({ success: true, data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function handleAutofillScan(payload: any) {
  try {
    const res = await fetch(`${API_BASE}/autofill/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    // Fallback local matching engine when backend server is offline
    return fallbackLocalMatcher(payload);
  }
}

async function handleSaveCorrection(payload: any) {
  try {
    const res = await fetch(`${API_BASE}/mappings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    return { success: true, fallback: true };
  }
}

function fallbackLocalMatcher(payload: any) {
  const profile = {
    full_name: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-5678",
    linkedin: "https://linkedin.com/in/alexmorgan-dev",
    github: "https://github.com/alexmorgan-dev",
    portfolio: "https://alexmorgan.dev",
    company: "Apex Tech Labs",
    designation: "Senior Software Engineer",
    experience: "4 Years",
    college: "Stanford University",
    degree: "Bachelor of Science",
    city: "San Francisco",
    state: "California",
    country: "United States"
  };

  const matches: any[] = [];
  const fields = payload.fields || [];

  for (const field of fields) {
    const text = (field.label + " " + field.name + " " + field.placeholder + " " + field.field_id).toLowerCase();
    let value = "";
    let key = "";

    if (text.includes("name") && !text.includes("company")) {
      value = profile.full_name; key = "full_name";
    } else if (text.includes("email") || text.includes("mail")) {
      value = profile.email; key = "email";
    } else if (text.includes("phone") || text.includes("mobile") || text.includes("cell")) {
      value = profile.phone; key = "phone";
    } else if (text.includes("linkedin")) {
      value = profile.linkedin; key = "linkedin";
    } else if (text.includes("github")) {
      value = profile.github; key = "github";
    } else if (text.includes("portfolio") || text.includes("website")) {
      value = profile.portfolio; key = "portfolio";
    } else if (text.includes("company") || text.includes("employer")) {
      value = profile.company; key = "company";
    } else if (text.includes("title") || text.includes("role") || text.includes("designation")) {
      value = profile.designation; key = "designation";
    } else if (text.includes("college") || text.includes("university") || text.includes("school")) {
      value = profile.college; key = "college";
    } else if (field.tag_name === "textarea" || text.includes("why") || text.includes("describe")) {
      value = "I am an experienced engineer with a proven track record of architecting scalable applications and collaborating in fast-paced product teams.";
      key = "ai_long_answer";
    }

    if (value) {
      matches.push({
        field_id: field.field_id || field.name || field.css_selector,
        css_selector: field.css_selector || `#${field.field_id}`,
        matched_key: key,
        matched_value: value,
        confidence_score: 0.9,
        is_ai_generated: key === "ai_long_answer"
      });
    }
  }

  return {
    matches,
    total_fields: fields.length,
    matched_fields_count: matches.length
  };
}
