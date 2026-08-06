// AI Form Copilot - Content Script DOM Engine

console.log("⚡ AI Form Copilot Content Script Active");

// Create Floating Shadow DOM Action Overlay Button
function injectFloatingWidget() {
  if (document.getElementById("ai-form-copilot-host")) return;

  const forms = document.querySelectorAll("form, input, textarea, select");
  if (forms.length === 0) return;

  const host = document.createElement("div");
  host.id = "ai-form-copilot-host";
  host.style.position = "fixed";
  host.style.bottom = "24px";
  host.style.right = "24px";
  host.style.zIndex = "2147483647";

  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      .copilot-btn {
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        color: #ffffff;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 13px;
        font-weight: 600;
        padding: 10px 16px;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;
      }
      .copilot-btn:hover {
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0 15px 30px -5px rgba(37, 99, 235, 0.6);
      }
      .copilot-badge {
        background: rgba(255, 255, 255, 0.2);
        padding: 2px 6px;
        border-radius: 99px;
        font-size: 10px;
        font-family: monospace;
      }
      .copilot-toast {
        position: fixed;
        bottom: 80px;
        right: 24px;
        background: #0f172a;
        color: #f8fafc;
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 12px 16px;
        font-family: system-ui, sans-serif;
        font-size: 12px;
        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);
        display: none;
        align-items: center;
        gap: 8px;
      }
    </style>
    <button class="copilot-btn" id="autofill-btn">
      <span>⚡ Fill Form with AI Copilot</span>
      <span class="copilot-badge">Ctrl+Shift+F</span>
    </button>
    <div class="copilot-toast" id="toast"></div>
  `;

  document.body.appendChild(host);

  const btn = shadow.getElementById("autofill-btn");
  btn?.addEventListener("click", () => performAutofill(shadow));
}

// Extract DOM input elements metadata
function extractFormFields() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>("input, textarea, select, [contenteditable='true']"));
  const extractedFields: any[] = [];

  elements.forEach((el, index) => {
    // Ignore hidden or button inputs
    if (el instanceof HTMLInputElement && ["hidden", "submit", "button", "image", "reset"].includes(el.type)) {
      return;
    }

    const fieldId = el.id || `field_${index}`;
    const name = (el as HTMLInputElement).name || "";
    const placeholder = (el as HTMLInputElement).placeholder || "";
    const ariaLabel = el.getAttribute("aria-label") || "";
    
    // Find associated label text
    let labelText = "";
    if (el.id) {
      const labelEl = document.querySelector(`label[for="${el.id}"]`);
      if (labelEl) labelText = labelEl.textContent || "";
    }
    if (!labelText && el.closest("label")) {
      labelText = el.closest("label")?.textContent || "";
    }
    if (!labelText && el.previousElementSibling && ["label", "span", "div"].includes(el.previousElementSibling.tagName.toLowerCase())) {
      labelText = el.previousElementSibling.textContent || "";
    }

    // Nearby text context
    const parentText = el.parentElement?.textContent?.slice(0, 100) || "";

    extractedFields.push({
      field_id: fieldId,
      name: name,
      placeholder: placeholder,
      aria_label: ariaLabel,
      label: labelText.trim().replace(/\s+/g, " "),
      parent_label: parentText.trim().replace(/\s+/g, " "),
      input_type: (el as HTMLInputElement).type || el.tagName.toLowerCase(),
      tag_name: el.tagName.toLowerCase(),
      required: (el as HTMLInputElement).required || false,
      css_selector: generateCSSSelector(el)
    });
  });

  return { elements, extractedFields };
}

function generateCSSSelector(el: HTMLElement): string {
  if (el.id) return `#${CSS.escape(el.id)}`;
  if ((el as HTMLInputElement).name) return `[name="${CSS.escape((el as HTMLInputElement).name)}"]`;
  return el.tagName.toLowerCase();
}

async function performAutofill(shadowRoot?: ShadowRoot) {
  const { elements, extractedFields } = extractFormFields();

  if (extractedFields.length === 0) {
    showToast(shadowRoot, "No autofillable form inputs detected on this page.");
    return;
  }

  showToast(shadowRoot, "Scanning DOM & matching profile fields...");

  chrome.runtime.sendMessage(
    {
      action: "SCAN_AND_AUTOFILL",
      payload: {
        page_title: document.title,
        page_url: window.location.href,
        fields: extractedFields
      }
    },
    (response) => {
      if (!response || !response.success || !response.data) {
        showToast(shadowRoot, "Error connecting to AI Form Copilot engine.");
        return;
      }

      const matches = response.data.matches || [];
      let filledCount = 0;

      matches.forEach((match: any) => {
        const targetEl = document.querySelector(match.css_selector) || document.getElementById(match.field_id);
        if (targetEl && targetEl instanceof HTMLElement) {
          fillNativeInput(targetEl, match.matched_value);
          filledCount++;
        }
      });

      showToast(shadowRoot, `⚡ ${filledCount} form fields autofilled in 0.3s!`);
    }
  );
}

function fillNativeInput(element: HTMLElement, value: string) {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    element.focus();
    element.value = value;
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    element.dispatchEvent(new Event("blur", { bubbles: true }));
  } else if (element instanceof HTMLSelectElement) {
    element.focus();
    for (let i = 0; i < element.options.length; i++) {
      if (element.options[i].text.toLowerCase().includes(value.toLowerCase()) || element.options[i].value.toLowerCase() === value.toLowerCase()) {
        element.selectedIndex = i;
        break;
      }
    }
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function showToast(shadowRoot: ShadowRoot | undefined, message: string) {
  if (!shadowRoot) return;
  const toast = shadowRoot.getElementById("toast");
  if (toast) {
    toast.style.display = "flex";
    toast.textContent = message;
    setTimeout(() => {
      toast.style.display = "none";
    }, 4000);
  }
}

// Listen to keyboard shortcut from background service worker
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "TRIGGER_AUTOFILL") {
    const host = document.getElementById("ai-form-copilot-host");
    const shadow = host?.shadowRoot || undefined;
    performAutofill(shadow);
  }
});

// Auto-inject overlay button on load
if (document.readyState === "complete" || document.readyState === "interactive") {
  injectFloatingWidget();
} else {
  window.addEventListener("DOMContentLoaded", injectFloatingWidget);
}
