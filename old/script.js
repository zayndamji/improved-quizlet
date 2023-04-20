const tempSet = getCookie('set')
if (tempSet != "")
  document.getElementById('set').value = tempSet
selectSet()

let correct = 0, wrong = 0, words = [], flipped = false, content = '', ended = false;

function refreshStats() {
  document.getElementById('total').textContent = words.length
  document.getElementById('correct').textContent = correct
  document.getElementById('wrong').textContent = wrong
  document.getElementById('unanswered').textContent = words.length - correct - wrong
}

function importFromFile(filename) {
  $.get(filename, newContent => {
    clearWords()
    content = newContent
    generateWords()
    generateQuiz()
    document.getElementById(0).select()
    restartQuiz()
    shuffleWords()
  })
}

function selectSet() {
  setCookie('set', document.getElementById('set').value, 60)
  importFromFile(`/sets/${document.getElementById('set').value}.txt`)
}

function flipWords(flip) {
  clearWords()
  flipped = flip
  generateWords()
  generateQuiz()
  document.getElementById(0).select()
  restartQuiz()
  shuffleWords()
}

function shuffleWords() {
  clearWords()
  generateWords()
  let newWords = [], oldWords = JSON.parse(JSON.stringify(words))
  for (let i = 0; i < words.length; i++) {
    const index = Math.floor(Math.random() * oldWords.length)
    newWords.push(oldWords[index])
    oldWords.splice(index, 1)
  }
  words = newWords
  generateQuiz()
  document.getElementById(0).select()
  restartQuiz()
}

function generateWords() {
  content.split('\n').forEach(word => {
    if (flipped) words.push(word.split('\t').reverse())
    else words.push(word.split('\t'))
  })
}

function restartQuiz() {
  for (let i = 0; i < words.length; i++) {
    const question = document.getElementById(i)
    question.value = ''
    question.removeAttribute('readonly')
    question.style.borderColor = 'lightgray'
    question.setAttribute('qstate', 'unsolved')
    const div = document.getElementById(`div${i}`)
    const correct = document.getElementById(`correct${i}`)
    if (correct != undefined)
      div.removeChild(correct)
    const button = document.getElementById(`button${i}`)
    if (button != undefined)
      div.removeChild(button)
  }
  document.getElementById(0).select()
  document.body.scrollTop = document.documentElement.scrollTop = 0
  document.getElementById('newQuestionsDiv').setAttribute('hidden', 'hidden')
  correct = 0
  wrong = 0
  refreshStats()
}

function showImportFromQuizlet() {
  clearWords()
  document.getElementById('newQuestionsDiv').removeAttribute('hidden')
}

function clearWords() {
  document.getElementById('questions').textContent = ''
  words = []
}

function generateQuestions() {
  if (document.getElementById('newQuestions').value != '') {
    document.getElementById('newQuestionsDiv').setAttribute('hidden', 'hidden')
    content = document.getElementById('newQuestions').value
    generateWords()
    generateQuiz()
  }
  else {
    alert("You have not entered any input!")
  }
}

function generateQuiz() {
  for (let i = 0; i < words.length; i++) {
    const wordDiv = document.createElement('div')
    wordDiv.setAttribute('class', 'question')
    wordDiv.setAttribute('id', `div${i}`)

    const wordDesc = document.createElement('span')
    const wordInput = document.createElement('input')

    wordDesc.textContent = `${words[i][0]} - `
    wordInput.setAttribute('type', 'text')
    wordInput.setAttribute('id', i)
    wordInput.style.borderColor = 'lightgray'
    wordInput.setAttribute('oninput', 'this.parentNode.dataset.value = this.value')
    wordInput.setAttribute('size', '45')
    wordInput.setAttribute('qstate', 'unsolved')
    wordInput.addEventListener('keypress', e => {
      setTimeout(() => {
        const question = document.getElementById(i)
        if (e.key == 'Enter') {
          if (question.value.toLowerCase().trim() == words[i][1].toLowerCase()) {
            question.value = words[i][1]
            question.setAttribute('readonly', 'readonly')
            question.style.borderColor = 'lightgreen'
            question.setAttribute('qstate', 'solved')
            if (words.length > (i + 1))
              document.getElementById(i + 1).select()
            else
              setTimeout(() => { alert('Good job! You completed everything!') }, 100)
            correct++
          }
          else {
            question.setAttribute('readonly', 'readonly')
            question.style.borderColor = 'red'
            question.setAttribute('qstate', 'wrong')
            const span = document.createElement('span')
            span.textContent = ` ${words[i][1]}  `
            span.style.color = 'red'
            span.style.fontSize = '80%'
            span.setAttribute('id', `correct${i}`)
            const button = document.createElement('button')
            button.textContent = 'Override - I was correct'
            button.setAttribute('id', `button${i}`)
            button.style.fontSize = '70%'
            button.addEventListener('click', () => {
              const deleteButton = document.getElementById(`button${i}`)
              const deleteSpan = document.getElementById(`correct${i}`)
              const div = document.getElementById(`div${i}`)
              div.removeChild(deleteButton)
              div.removeChild(deleteSpan)
              question.value = words[i][1]
              question.style.borderColor = 'lightgreen'
              if (words.length > (i + 1))
                document.getElementById(i + 1).select()
              wrong--
              correct++
              refreshStats()
            })
            if (!ended || words.length > (i + 1)) {
              document.getElementById(`div${i}`).append(span)
              document.getElementById(`div${i}`).append(button)
            }
            if (words.length > (i + 1))
              document.getElementById(i + 1).select()
            else
              ended = true
            wrong++
          }
        }

        refreshStats()
      }, 10)
    })

    wordDiv.append(wordDesc)
    wordDiv.append(wordInput)

    document.getElementById('questions').append(wordDiv)
  }
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}