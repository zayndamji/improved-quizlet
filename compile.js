const pug = require('pug');
const fs = require('fs');

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
  pug.renderFile('src/index.html', {
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