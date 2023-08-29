let setIsStillValid = true;
const tempSet = getLocalStorage('set');
if (tempSet != "") {
  Array.from(document.getElementById('set').children).forEach(e => e.children[0].checked = false);
  for (const set of tempSet.split(';')) {
    const prevSet = document.querySelector('input[type="checkbox"][name="set"]#' + set);
    if (prevSet != undefined) {
      prevSet.checked = true;
    } else {
      setIsStillValid = false;
    }
  }
  console.log('Fin.');
} else {
  setIsStillValid = false;
}

const tempStatus = getLocalStorage('status');
if (tempStatus != "") {
  toggleStatus(tempStatus == 'true');
  console.log('User has toggled status before.')
}

const tempAccents = getLocalStorage('accents');
if (tempAccents != "") {
  toggleAccents(tempAccents == 'true');
  console.log('User has toggled accents before.')
}

const tempMuteSound = getLocalStorage('mutesound');
if (tempMuteSound != "") {
  toggleMute(tempMuteSound == 'true');
  console.log('User has toggled muting sound before.')
}

const tempColumns = getLocalStorage('columns');
if (tempColumns != "") {
  toggleColumns(tempColumns == 'true');
  console.log('User has toggled columns before.')
}

const tempWords = getLocalStorage('words');
const tempContent = getLocalStorage('content');
if (tempWords != "" && tempWords != '[]' && tempContent != "" && setIsStillValid) {
  content = tempContent;
  words = JSON.parse(tempWords);
  regenerateQuiz();
  console.log('User has previous data... regenerating quiz from saved data.');
} else {
  Array.from(document.getElementById('set').children).forEach(e => e.children[0].checked = false);
  document.querySelector('input[type="checkbox"][name="set"]').checked = true;
  selectSet();
  console.log('User is new... generating quiz from scratch.');
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, value);
  console.log(key + ' set to a value of length ' + value.length + '.');
  console.trace();
}

function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  if (value === null) return '';
  return value;
}