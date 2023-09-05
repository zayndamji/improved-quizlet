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

const tempSplashscreen = getLocalStorage('splash');
if (tempSplashscreen != "") {
  toggleSplashscreen(tempSplashscreen == 'true');
  console.log('User has toggled splashscreen before.')
}

const tempFlipped = getLocalStorage('flipped');
if (tempFlipped != "") {
  flipped = tempFlipped == 'true';
  updateFlipped();
  console.log('User has toggled language before.')
}

const tempWords = getLocalStorage('words');
if (tempWords != "" && tempWords != '[]' && setIsStillValid) {
  selectSet();
  words = JSON.parse(tempWords);
  resetScreen();
  regenerateQuiz();
  console.log('User has previous data... regenerating quiz from saved data.');
} else {
  Array.from(document.getElementById('set').children).forEach(e => e.children[0].checked = false);
  document.querySelectorAll('input[type="checkbox"][name="set"]')[2].checked = true;
  selectSet();
  console.log('User is new... generating quiz from scratch.');
}