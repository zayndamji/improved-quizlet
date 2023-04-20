const express = require('express');
const app = express();

let date = getDate();

app.get('/', (req, res, next) => {
  console.log('Website accessed on ' + getDate());
  next();
});
app.use('/', express.static('./serve/'));

app.listen(() => {
  app._router.stack.forEach(r => {
    if (r.route && r.route.path) {
      console.log(`${r.route.stack[0].method.toUpperCase()} ${r.route.path}`);
    }
  });
  console.log(`Server running at ${date}.`);
});

function getDate() {
  return new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles"
  });
}