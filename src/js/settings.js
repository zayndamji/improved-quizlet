let showStatus = true;

function toggleStatus(newStatus) {
  showStatus = newStatus ?? !showStatus;
  setLocalStorage('status', showStatus.toString());
}

let ignoreAccents = false;

function toggleAccents(newAccents) {
  ignoreAccents = newAccents ?? !ignoreAccents;
  setLocalStorage('accents', ignoreAccents.toString());
}