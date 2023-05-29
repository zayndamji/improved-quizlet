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

let showAnswerWhenSkipped = false;

function toggleShowSkippedAnswer(newSkipped) {
  showAnswerWhenSkipped = newSkipped ?? !showAnswerWhenSkipped;
  setLocalStorage('skippedanswer', showAnswerWhenSkipped.toString());
  document.getElementById('skipped-answer-selector').checked = showAnswerWhenSkipped;
}

let muteSound = false;

function toggleMute(newMute) {
  muteSound = newMute ?? !muteSound;
  setLocalStorage('mutesound', muteSound.toString());
  document.getElementById('mute-selector').checked = muteSound;
}