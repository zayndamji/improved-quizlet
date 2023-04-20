function playSound(id, universal = false) {
  if (showStatus || universal) {
    const clone = document.getElementById(id).cloneNode(true);
    document.body.appendChild(clone);
    clone.onended = () => {
      document.body.removeChild(clone);
    };
    clone.play();
  }
}

function playSuccessSound() {
  playSound('success.mp3');
}

function playFailureSound() {
  playSound('failure.mp3');
}