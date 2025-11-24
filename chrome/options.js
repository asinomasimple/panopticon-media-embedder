// Default settings
const DEFAULT_SETTINGS = {
  enableBorder: true,
  borderColor: '#E685D5',
  borderWidth: 2
};

// Load saved settings
function loadSettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    document.getElementById('enableBorder').checked = settings.enableBorder;
    document.getElementById('borderColor').value = settings.borderColor;
    document.getElementById('borderWidth').value = settings.borderWidth;

    updateColorPreview(settings.borderColor);
    updateFieldStates(settings.enableBorder);
  });
}

// Update color preview
function updateColorPreview(color) {
  const preview = document.getElementById('colorPreview');
  preview.style.backgroundColor = color;
}

// Update field enabled/disabled states
function updateFieldStates(borderEnabled) {
  document.getElementById('borderColor').disabled = !borderEnabled;
  document.getElementById('borderWidth').disabled = !borderEnabled;
}

// Save settings
function saveSettings() {
  const settings = {
    enableBorder: document.getElementById('enableBorder').checked,
    borderColor: document.getElementById('borderColor').value,
    borderWidth: parseInt(document.getElementById('borderWidth').value)
  };

  chrome.storage.sync.set(settings, () => {
    // Show success message
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.classList.add('success');

    setTimeout(() => {
      statusMessage.classList.remove('success');
    }, 2000);

    // Notify content scripts to update
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'settingsUpdated',
          settings: settings
        }).catch(() => {
          // Ignore errors for tabs that don't have the content script
        });
      });
    });
  });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();

  // Save button
  document.getElementById('saveButton').addEventListener('click', saveSettings);

  // Enable border checkbox
  document.getElementById('enableBorder').addEventListener('change', (e) => {
    updateFieldStates(e.target.checked);
  });

  // Color picker
  document.getElementById('borderColor').addEventListener('input', (e) => {
    updateColorPreview(e.target.value);
  });

  // Border width validation
  document.getElementById('borderWidth').addEventListener('change', (e) => {
    let value = parseInt(e.target.value);
    if (value < 1) value = 1;
    if (value > 10) value = 10;
    e.target.value = value;
  });
});
