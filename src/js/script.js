let words = [], flipped = false, content = '';

const specialChars = /;|,|\/| |-|\=|\[|\]|\{|\}|\?|<|>|'|"|\:|\+|_|\)|\(/g;
const convertToPlain = w => w.toLowerCase().replace(specialChars, '').trim();
const convertToNoAccents = w => w.replace('é', 'e').replace('á', 'a').replace('ú', 'u').replace('ñ', 'n').replace('í', 'i');

document.getElementById('spanish-english-toggle').addEventListener('change', e => {
  flipQuiz(e.target.checked);
  regenerateQuiz();
});

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
  shuffleWords();
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
  document.getElementById('questions').textContent = '';
  words = [];
}

function generateWords() {
  if (content.length > 0)
    content.split('\n').forEach(word => {
      const [term, definition] = word.split('\t');
      words.push({ term, definition, status: 0, word: '' });
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

function flipQuiz(newValue) {
  if (newValue == undefined)
    flipped = !flipped;
  else
    flipped = newValue;
  setLocalStorage('flipped', flipped.toString());
  document.getElementById('flipped-or-not').checked = flipped;
}

function regenerateQuiz() {
  document.getElementById('numberofsets').textContent = Array.from(document.querySelectorAll('input[name="set"]:checked')).map(e => e.value).length;
  
  if (words.length == 0) return;

  for (let i = 0; i < words.length; i++) {
    let { term, definition } = words[i];

    if (flipped) {
      const tempTerm = term;
      term = definition;
      definition = tempTerm;
    }

    const checkAnswer = (check, skip) => {
      const question = document.getElementById(i);

      if (check) {
        if (question.value.trim() == '') {
          words[i].status = 0;
          words[i].word = '';
        }
        else if (convertToPlain(question.value) == convertToPlain(definition) ||
                (ignoreAccents && (convertToNoAccents(convertToPlain(question.value)) == convertToNoAccents(convertToPlain(definition))))) {
          words[i].status = 2;
          if (skip) {
            splashscreenAnimation('green', 'Correct!');
            playSound('success.mp3');
          }
          words[i].word = definition;
        }
        else {
          words[i].status = 1;
          if (skip) {
            splashscreenAnimation('red', 'Wrong!');
            playSound('failure.mp3');
          }
          words[i].word = question.value.trim();
        }

        if (i + 1 == words.length && question.value.trim().length > 0)
          toggleStatus(true);

        regenerateQuiz();

        if (skip && i + 1 < words.length)
          document.getElementById(i + 1).select();
      }
    }

    if (document.getElementById(i) == undefined) {
      const wordDiv = document.createElement('div');
      wordDiv.setAttribute('class', 'question');
      wordDiv.setAttribute('id', `div${i}`);

      const wordDesc = document.createElement('span');
      wordDesc.innerHTML = `${term} -&nbsp;`;
      wordDesc.setAttribute('id', `desc${i}`);

      const wordInput = document.createElement('input');
      wordInput.style.borderColor = 'lightgray';
      wordInput.setAttribute('type', 'text');
      wordInput.setAttribute('id', i);
      wordInput.style.flex = 1;

      wordInput.addEventListener('keypress', e => checkAnswer(e.key == 'Enter', true));
      wordInput.addEventListener('blur', e => checkAnswer(true, false));

      wordDiv.append(wordDesc);
      wordDiv.append(wordInput);

      document.getElementById('questions').append(wordDiv);
    }

    const div = document.getElementById(`div${i}`);
    const desc = document.getElementById(`desc${i}`);
    let question = document.getElementById(i);

    if (desc.innerHTML != `${term} -&nbsp;`) {
      desc.innerHTML = `${term} -&nbsp;`;
      question.replaceWith(question.cloneNode(true));
      question = document.getElementById(i);
      question.addEventListener('keypress', e => checkAnswer(e.key == 'Enter', true));
      question.addEventListener('blur', e => checkAnswer(true, false));
      words[i].status = 0;
      words[i].word = '';
    }

    question.value = words[i].word;

    const wrong = document.getElementById(`wrong${i}`);
    if (wrong != undefined)
      div.removeChild(wrong);

    if (showStatus) {
      question.style.borderColor = words[i].status == 1 ? 'red' :
        words[i].status == 2 ? 'lightgreen' :
          'lightgray';
    } else {
      question.style.borderColor = 'lightgray';
    }

    if (words[i].status == 1 && showStatus) {
      const span = document.createElement('span');
      if (flipped)
        span.innerHTML = `&nbsp;${words[i].term}  `;
      else
        span.innerHTML = `&nbsp;${words[i].definition}  `;
      span.style.color = 'red';
      span.style.fontSize = '80%';
      span.setAttribute('id', `wrong${i}`);
      div.append(span);
    }
  }

  // document.getElementById('total').textContent = words.length;
  // document.getElementById('correct').textContent = words.filter(word => word.status == 2).length;
  // document.getElementById('wrong').textContent = words.filter(word => word.status == 1).length;
  // document.getElementById('unanswered').textContent = words.filter(word => word.status == 0).length;

  const percentage = words.filter(word => word.status == 2).length / words.length * 100;
  const text = `${Math.floor(percentage)}% (${words.filter(word => word.status == 2).length}/${words.length})`;
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

  // if (words.filter(word => word.status == 2).length == words.length) {
  //   document.getElementById('stats').style.backgroundColor = 'green';
  //   document.getElementById('stats').style.color = 'white';
  // }
  // else {
  //   document.getElementById('stats').style.backgroundColor = 'inherit';
  //   document.getElementById('stats').style.color = 'inherit';
  // }

  setLocalStorage('words', JSON.stringify(words));
}

function solveQuiz() {
  for (let i = 0; i < words.length; i++) {
    words[i].status = 2;
    words[i].word = flipped ? words[i].term : words[i].definition;
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

function selectAllSets(on) {
  Array.from(document.getElementById('set').children).forEach(e => Array.from(e.children).forEach(e => e.children[0].checked = on));
  selectSet();
}