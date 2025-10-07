let doingAnimation = false;

function customSplashScreenAnimation(background, text, color = 'white', onDuration, midDuration, offDuration) {
  if (doingAnimation || !showStatus || !splashscreenEnabled) return;

  doingAnimation = true;
  const id = 'splashscreen';
  document.getElementById(id).style.backgroundColor = background;
  document.getElementById(id).style.color = color;
  document.getElementById(`${id}-inner`).textContent = text;

  document.getElementById(id).style.display = 'block'
  document.getElementById(id).style.animationDirection = 'normal';
  document.getElementById(id).style.animation = `splashscreen-on ${onDuration}ms`;
  setTimeout(() => {
    doingAnimation = true;
    document.getElementById(id).style.opacity = '100%';
    setTimeout(() => {
      doingAnimation = true;
      document.getElementById(id).style.animationDirection = 'normal';
      document.getElementById(id).style.animation = `splashscreen-off ${offDuration}ms`;
      document.getElementById(id).style.opacity = '0%';
      setTimeout(() => {
        document.getElementById(id).style.display = 'none';
        doingAnimation = false;
      }, offDuration);
    }, midDuration);
  }, onDuration - 50);
}

function splashscreenAnimation(background, text, color = 'white') {
  customSplashScreenAnimation(background, text, color, 200, 300, 300);
}

function longSplashscreenAnimation(background, text, color = 'white') {
  customSplashScreenAnimation(background, text, color, 200, 600, 300);
}