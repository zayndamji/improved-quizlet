let showStatus = true;

function toggleStatus(newStatus) {
  showStatus = newStatus ?? !showStatus;
  setLocalStorage('status', showStatus.toString());
  document.getElementById('status-selector').textContent = (showStatus ? 'Hide' : 'Show') + ' whether Correct or Incorrect';
}

let ignoreAccents = false;

function toggleAccents(newAccents) {
  ignoreAccents = newAccents ?? !ignoreAccents;
  setLocalStorage('accents', ignoreAccents.toString());
  document.getElementById('accents-selector').textContent = (ignoreAccents ? 'Check' : 'Ignore') + ' Accents';
}