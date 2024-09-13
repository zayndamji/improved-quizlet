let words = [], content = '', flipped = true;

const specialChars = /;|,|\/| |-|\=|\[|\]|\{|\}|\?|<|>|'|"|\:|\+|_|\)|\(|‎/g;
const convertToPlain = w => w.toLowerCase().replace(specialChars, '').trim();
const convertToNoAccents = w => w.replace('é', 'e').replace('á', 'a').replace('ú', 'u').replace('ñ', 'n').replace('í', 'i').replace('ó', 'o').replace('ü', 'u');

function selectSet() {
  const setValue = Array.from(document.querySelectorAll('input[name="set"]:checked')).map(e => e.value);
  setLocalStorage('set', setValue.join(';'));
  importFromFile(setValue);
}

async function importFromFile(filename) {
  content = ''
  for (let i = 0; i < filename.length; i++) {
    content += document.getElementById(`meta-set-${filename[i]}.txt`).getAttribute('content') + '\n';
  }
  content = content.trim();

  clearWords();
  generateWords();
  shuffleWords();
  restartQuiz();
  updateFlipped();
  regenerateQuiz();
}

function restartQuiz() {
  for (let i = 0; i < words.length; i++) {
    words[i].status = Array(words[i].definition.length).fill(0);
    words[i].word = Array(words[i].definition.length).fill('');
  }
  
  if (document.getElementById(0) != undefined)
    document.getElementById(0).children[1].children[0].select();
}

function resetScreen() {
  const topRow = document.getElementById('firstrow');
  const topRow2 = document.getElementById('firstrow2');
  console.log(topRow, topRow2)
  document.getElementById('main-table').textContent = '';
  document.getElementById('main-table').append(topRow);
  document.getElementById('main-table').append(topRow2);
  if (getLocalStorage('set').includes('presentverbs')) {
    document.getElementById('firstrow').style.display = 'flex';
    document.getElementById('firstrow2').style.display = 'none';
  } else if (getLocalStorage('set').includes('tuustedustedes')) {
    document.getElementById('firstrow').style.display = 'none';
    document.getElementById('firstrow2').style.display = 'flex';
  } else {
    document.getElementById('firstrow').style.display = 'none';
    document.getElementById('firstrow2').style.display = 'none';
  }
}

function updateFlipped() {
  document.getElementById('current-lang').textContent = flipped ? 'English' : 'Spanish';
  document.getElementById('flipped-or-not').checked = flipped;
  
  for (let i = 0; i < words.length; i++) {
    const originalTerm = words[i].originalTerm;
    if (originalTerm == words[i].term && flipped) {
      const tempTerm = words[i].term;
      words[i].term = words[i].definition[0];
      words[i].definition[0] = tempTerm;
    } else if (originalTerm == words[i].definition[0] && !flipped) {
      const tempTerm = words[i].term;
      words[i].term = words[i].definition[0];
      words[i].definition[0] = tempTerm;
    }
  }
}

function clearWords() {
  resetScreen();
  words = [];
}

function generateWords() {
  if (content.length > 0)
    content.split('\n').forEach(word => {
      const term = word.split('\t')[0];
      const originalTerm = '' + term;
      console.log(term);
      const definition = word.split('\t').slice(1);
      words.push({ originalTerm, term, definition, status: Array(definition.length).fill(0), word: Array(definition.length).fill('') });
    })
}

function shuffleWords() {
  let newWords = [], oldWords = JSON.parse(JSON.stringify(words));
  for (let i = 0; i < words.length; i++) {
    const index = Math.floor(Math.random() * oldWords.length);
    newWords.push(oldWords[index]);
    oldWords.splice(index, 1);
  }
  words = newWords;
}

function switchTermAndDefinition() {
  flipped = !flipped;
  updateFlipped();
  setLocalStorage('flipped', flipped.toString());
}

function regenerateQuiz() {
  document.getElementById('numberofsets').textContent = Array.from(document.querySelectorAll('input[name="set"]:checked')).map(e => e.value).length;
  
  if (words.length == 0) return;

  for (let i = 0; i < words.length; i++) {
    const checkAnswer = (target, check, skip) => {
      const i = parseInt(target.getAttribute('i'));
      const j = parseInt(target.getAttribute('j'));
      const singleDefinition = words[i].definition[j];

      if (check) {
        if (target.value.trim() == '') {
          words[i].status[j] = 0;
          words[i].word[j] = '';
        }

        else if (convertToPlain(target.value) == convertToPlain(singleDefinition) ||
                (ignoreAccents && (convertToNoAccents(convertToPlain(target.value)) == convertToNoAccents(convertToPlain(singleDefinition))))) {
          words[i].status[j] = 2;
          if (skip) {
            splashscreenAnimation('green', 'Correct!');
            playSuccessSound();
          }
          words[i].word[j] = singleDefinition;
        }

        else {
          words[i].status[j] = 1;
          if (skip) {
            splashscreenAnimation('red', 'Wrong!');
            playFailureSound();
          }
          words[i].word[j] = target.value.trim();
        }

        regenerateQuiz();

        if (skip && (i + 1 < words.length || j + 1 < words[i].definition.length)) {
          if (testInColumns) {
            if (document.getElementById(`input-${i+1}-${j}`) == undefined) {
              document.getElementById(`input-0-${j+1}`).select();
            } else {
              document.getElementById(`input-${i+1}-${j}`).select();
            }
          } else {
            if (document.getElementById(`input-${i}-${j+1}`) == undefined) {
              document.getElementById(`input-${i+1}-0`).select();
            } else {
              document.getElementById(`input-${i}-${j+1}`).select();
            }
          }
        }
      }
    }

    if (document.getElementById(i) == undefined) {
      const table = document.getElementById('main-table');
      const row = document.createElement('tr');
      row.id = i;
      row.className = '';

      const term = document.createElement('th');
      term.textContent = words[i].term;
      row.appendChild(term);

      console.log(words[i].definition.length)
      for (let j = 0; j < words[i].definition.length; j++) {
        const definition = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `input-${i}-${j}`;
        input.setAttribute('i', i);
        input.setAttribute('j', j);
        input.classList.add('isInput');
        input.value = words[i].word[j];
        input.addEventListener('keypress', e => checkAnswer(e.target, e.key == 'Enter', true));
        input.addEventListener('blur', e => checkAnswer(e.target, true, false));
        definition.appendChild(input);
        row.appendChild(definition);
      }

      table.appendChild(row);
    }

    for (const inputWord of document.getElementsByClassName('isInput')) {
      const i = parseInt(inputWord.getAttribute('i'));
      const j = parseInt(inputWord.getAttribute('j'));

      if (showStatus) {
        inputWord.style.borderColor = words[i].status[j] == 1 ? 'red' :
          words[i].status[j] == 2 ? 'lightgreen' :
            'lightgray';
      } else {
        inputWord.style.borderColor = 'lightgray';
      }

      if (inputWord.value != words[i].word[j]) {
        inputWord.value = words[i].word[j];
      }

      const wrong = document.getElementById(`wrong-${i}-${j}`);
      if (wrong != undefined) {
        inputWord.parentElement.removeChild(wrong);
      }

      if (words[i].status[j] == 1 && showStatus) {
        const span = document.createElement('span');
        span.innerHTML = `&nbsp;${words[i].definition[j]}`;
        span.style.color = 'red';
        span.style.fontSize = '80%';
        span.setAttribute('id', `wrong-${i}-${j}`);
        inputWord.parentElement.append(span);
      }
    }
  }

  let correct = 0, total = 0;
  for (const word of words) {
    for (const status of word.status) {
      total++;
      if (status == 2) correct++;
    }
  }

  const percentage = correct / total * 100;
  const text = `${Math.floor(percentage)}% (${correct}/${total})`;
  if (!showStatus) {
    document.getElementById('outer-progress-text').textContent = 'Progress Hidden';
    document.getElementById('outer-progress-text').style.display = 'block';
    document.getElementById('progress-bar').style.display = 'none';
  }
  else if (percentage < 1) {
    document.getElementById('outer-progress-text').textContent = text;
    document.getElementById('progress-bar').style.display = 'none';
  }
  else {
    document.getElementById('outer-progress-text').textContent = text;
    document.getElementById('progress-bar').style.width = Math.floor(percentage) * 0.93 + '%';
    document.getElementById('progress-bar').style.display = 'block';
  }

  setLocalStorage('words', JSON.stringify(words));
}

function solveQuiz() {
  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < words[i].definition.length; j++) {
      words[i].status[j] = 2;
      words[i].word[j] = words[i].definition[j];
    }
  }
  regenerateQuiz();
  longSplashscreenAnimation('green', '100%..?');
}

function selectAllSets(on, id) {
  Array.from(document.getElementById(id).children).forEach(e => e.children[0].checked = on);
  selectSet();
}

document.getElementById('flipped-or-not').addEventListener('change', () => {
  switchTermAndDefinition();
  resetScreen();
  restartQuiz();
  regenerateQuiz();
})