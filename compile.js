const pug = require('pug');
const fs = require('fs');

if (!fs.existsSync('serve')) {
  fs.mkdirSync('serve');
}

function audioToBase64(audioFile) {
  return 'data:audio/mpeg;base64,' + fs.readFileSync(audioFile).toString('base64');
}

const sounds = fs.readdirSync('src/sounds/').map(e => {
  return {
    id: e,
    data: audioToBase64('src/sounds/' + e)
  }
});

fs.writeFileSync('serve/index.html',
  pug.renderFile('src/index.pug', {
    setData: fs.readdirSync('src/sets').map(e => {
      return {
        name: e,
        content: fs.readFileSync('src/sets/' + e, { encoding: 'utf-8' }),
      }
    }),
    sounds,
    options: JSON.parse(fs.readFileSync('src/options.json', { encoding: 'utf-8' }))
  }
));

if (!fs.existsSync('serve/spanish1')) {
  fs.mkdirSync('serve/spanish1');
}

fs.writeFileSync('serve/spanish1/index.html',
  pug.renderFile('spanish1/index.pug', {
    setData: fs.readdirSync('spanish1/sets').map(e => {
      return {
        name: e,
        content: fs.readFileSync('spanish1/sets/' + e, { encoding: 'utf-8' }),
      }
    }),
    sounds,
    options: JSON.parse(fs.readFileSync('spanish1/options.json', { encoding: 'utf-8' }))
  }
));

if (!fs.existsSync('serve/spanish2')) {
  fs.mkdirSync('serve/spanish2');
}

fs.writeFileSync('serve/spanish2/index.html',
  pug.renderFile('spanish2/index.pug', {
    setData: fs.readdirSync('spanish2/sets').map(e => {
      return {
        name: e,
        content: fs.readFileSync('spanish2/sets/' + e, { encoding: 'utf-8' }),
      }
    }),
    sounds,
    options: JSON.parse(fs.readFileSync('spanish2/options.json', { encoding: 'utf-8' }))
  }
));

if (!fs.existsSync('serve/spanish2old')) {
  fs.mkdirSync('serve/spanish2old');
}

fs.writeFileSync('serve/spanish2old/index.html',
  pug.renderFile('spanish2old/index.pug', {
    setData: fs.readdirSync('spanish2old/sets').map(e => {
      return {
        name: e,
        content: fs.readFileSync('spanish2old/sets/' + e, { encoding: 'utf-8' }),
      }
    }),
    sounds,
    options: JSON.parse(fs.readFileSync('spanish2old/options.json', { encoding: 'utf-8' }))
  }
));

if (!fs.existsSync('serve/spanish3')) {
  fs.mkdirSync('serve/spanish3');
}

fs.writeFileSync('serve/spanish3/index.html',
  pug.renderFile('spanish3/index.pug', {
    setData: fs.readdirSync('spanish3/sets').map(e => {
      return {
        name: e,
        content: fs.readFileSync('spanish3/sets/' + e, { encoding: 'utf-8' }),
      }
    }),
    sounds,
    options: JSON.parse(fs.readFileSync('spanish3/options.json', { encoding: 'utf-8' }))
  }
));

if (!fs.existsSync('serve/copy')) {
  fs.mkdirSync('serve/copy');
}

fs.copyFileSync('copy/index.html', 'serve/copy/index.html');