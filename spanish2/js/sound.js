function playSound(id, universal = false) {
  if ((showStatus || universal) && !muteSound) {
    const clone = document.getElementById(id).cloneNode(true);
    document.body.appendChild(clone);
    clone.onended = () => {
      document.body.removeChild(clone);
    };
    clone.play();
  }
}

function playSuccessSound() {
  const index = (Math.floor(Math.random() * 4) + 1).toFixed(0);
  playSound(`success${index}.mp3`);
}

function playFailureSound() {
  const index = (Math.floor(Math.random() * 2) + 1).toFixed(0);
  playSound(`failure${index}.mp3`);
}