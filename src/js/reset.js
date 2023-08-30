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

if (getLocalStorage('words') != '' && getLocalStorage('words') != '[]') {
  const tempWords = JSON.parse(getLocalStorage('words'));
  if (tempWords[0].originalTerm == undefined || tempWords[0].originalTerm == '') {
    localStorage.removeItem('words');
  }
}