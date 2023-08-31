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

let muteSound = false;

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

let splashscreenEnabled = false;

function toggleSplashscreen(newSplashscreen) {
  splashscreenEnabled = newSplashscreen ?? !splashscreenEnabled;
  setLocalStorage('splash', splashscreenEnabled.toString());
  document.getElementById('splashscreen-selector').checked = splashscreenEnabled;
}