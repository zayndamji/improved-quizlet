let showStatus = true;

function toggleStatus(newStatus) {
  showStatus = newStatus ?? !showStatus;
  setLocalStorage('status', showStatus.toString());
  document.getElementById('status-selector').checked = !showStatus;
}

let ignoreAccents = false;

function toggleAccents(newAccents) {
  ignoreAccents = newAccents ?? !ignoreAccents;
  setLocalStorage('accents', ignoreAccents.toString());
  document.getElementById('accents-selector').checked = ignoreAccents;
}

let muteSound = true;

function toggleMute(newMute) {
  muteSound = newMute ?? !muteSound;
  setLocalStorage('mutesound', muteSound.toString());
  document.getElementById('mute-selector').checked = muteSound;
}

let testInColumns = false;

function toggleColumns(newColumns) {
  testInColumns = newColumns ?? !testInColumns;
  setLocalStorage('columns', testInColumns.toString());
  document.getElementById('column-selector').checked = testInColumns;
}

// Dropdown toggle functions
function toggleSettings() {
  const content = document.getElementById('settings-content');
  const button = document.getElementById('settings-toggle');
  
  if (content.style.display === 'none' || content.style.display === '') {
    content.style.display = 'grid';
    button.textContent = 'Close';
  } else {
    content.style.display = 'none';
    button.textContent = 'Open';
  }
}

function toggleTopics() {
  const content = document.getElementById('set');
  const button = document.getElementById('topics-toggle');
  
  if (content.style.display === 'none' || content.style.display === '') {
    content.style.display = 'block';
    button.textContent = 'Close';
  } else {
    content.style.display = 'none';
    button.textContent = 'Open';
  }
}