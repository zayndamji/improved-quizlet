let words = [], content = '';

const specialChars = /;|,|\/| |-|\=|\[|\]|\{|\}|\?|<|>|'|"|\:|\+|_|\)|\(|‎/g;
const convertToPlain = w => w.toLowerCase().replace(specialChars, '').trim();
const convertToNoAccents = w => w.replace('é', 'e').replace('á', 'a').replace('ú', 'u').replace('ñ', 'n').replace('í', 'i');

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
  setLocalStorage('content', content);

  clearWords();
  generateWords();
  regenerateQuiz();
  restartQuiz();
}

function restartQuiz() {
  for (let i = 0; i < words.length; i++) {
    words[i].status = 0;
    words[i].word = '';
  }
  
  if (document.getElementById(0) != undefined)
    document.getElementById(0).select();
}

function clearWords() {
  document.getElementById('main-table').textContent = '';
  words = [];
}

function generateWords() {
  if (content.length > 0)
    content.split('\n').forEach(word => {
      const term = word.split('\t')[0];
      const definition = word.split('\t').slice(1);
      words.push({ term, definition, status: Array(definition.length).fill(0), word: Array(definition.length).fill('') });
    })
}

function regenerateQuiz() {
  document.getElementById('numberofsets').textContent = Array.from(document.querySelectorAll('input[name="set"]:checked')).map(e => e.value).length;
  
  if (words.length == 0) return;

  for (let i = 0; i < words.length; i++) {
    const checkAnswer = (target, check, skip) => {
      if (check) {
        const value = target.value;
        let status = 0;
        let word = '';
        let definition = target.getAttribute('definition');

        if (value.trim() == '') {
          if (skip) {
            status = 3;
            splashscreenAnimation('yellow', 'Skipped');
            word = '‎';
          }
        }
        else if (value.trim() == '‎') {
          status = 3;
          if (skip) {
            splashscreenAnimation('yellow', 'Skipped');
          }
          word = '‎';
        }
        else if (convertToPlain(value) == convertToPlain(definition) ||
                (ignoreAccents && (convertToNoAccents(convertToPlain(value)) == convertToNoAccents(convertToPlain(definition))))) {
          status = 2;
          if (skip) {
            splashscreenAnimation('green', 'Correct!');
            playSuccessSound();
          }
          word = definition;
        }
        else {
          status = 1;
          if (skip) {
            splashscreenAnimation('red', 'Wrong!');
            playFailureSound();
          }
          word = value.trim();
        }

        target.setAttribute('status', status);
        target.setAttribute('word', word);

        regenerateQuiz();

        // if (skip && i + 1 < words.length)
        //   document.getElementById(i + 1).select();
      }
    }

    if (document.getElementById(i) == undefined) {
      const table = document.getElementById('main-table');
      const row = document.createElement('tr');
      row.id = i;

      const term = document.createElement('th');
      term.textContent = words[i].term;
      row.appendChild(term);

      for (let j = 0; j < words[i].definition.length; i++) {
        const definition = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.setAttribute('id', Math.floor(Math.random() * 10000000));
        input.classList.add('isInput');
        input.addEventListener('keypress', e => checkAnswer(e.target, e.key == 'Enter', true));
        input.addEventListener('blur', e => checkAnswer(e.target, true, false));
        definition.appendChild(input);
        row.appendChild(definition);
      }

      table.appendChild(row);
    }
  }

  for (const input of document.getElementsByClassName('isInput')) {
    input.value = input.getAttribute('word');
    const id = input.getAttribute('id');

    const wrong = document.getElementById(`wrong${id}`);
    if (wrong != undefined)
      input.parentElement.removeChild(wrong);

    const status = input.getAttribute('status');
    if (showStatus) {
      input.style.borderColor = status == 1 ? 'red' :
        status == 2 ? 'lightgreen' :
          status == 3 ? 'rgb(240, 240, 0)' :
            'lightgray';
    } else {
      input.style.borderColor = 'lightgray';
    }

    if ((status == 1 || (status == 3 && showAnswerWhenSkipped)) && showStatus) {
      const span = document.createElement('span');
      span.innerHTML = `&nbsp;${words[i].definition}  `;
      span.style.color = 'red';
      span.style.fontSize = '80%';
      span.setAttribute('id', `wrong${id}`);
      input.parentElement.append(span);
    }
  }

  const correctAmount = document.getElementsByClassName('isInput').filter(e => e.getAttribute('status') == 2).length;
  const percentage = correctAmount / words.length * 100;
  const text = `${Math.floor(percentage)}% (${correctAmount}/${words.length})`;

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

  // setLocalStorage('words', JSON.stringify(words));
}

function solveQuiz() {
  for (const input of document.getElementsByClassName('isInput')) {
    input.setAttribute('status', 2);
    input.setAttribute('word', words[i].definition);
  }
  regenerateQuiz();
  longSplashscreenAnimation('green', '100%..?');
}

function toggleInstructions() {
  if (document.getElementById('instructions').style.display == 'none')
    document.getElementById('instructions').style.display = 'block';
  else
    document.getElementById('instructions').style.display = 'none';
}

function selectAllSets(on, id) {
  Array.from(document.getElementById(id).children).forEach(e => e.children[0].checked = on);
  selectSet();
}