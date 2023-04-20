let showStatus = true;

function toggleStatus(newStatus) {
  showStatus = newStatus ?? !showStatus;
  setLocalStorage('status', showStatus.toString());
  document.getElementById('status-selector').textContent = (showStatus ? 'Hide' : 'Show') + ' whether Correct or Incorrect';
}