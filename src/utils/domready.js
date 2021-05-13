const domReady = () => new Promise((resolve) => {
  if (
    document.readyState === 'complete'
      || document.readyState === 'loaded'
  ) {
    resolve();
  } else {
    document.addEventListener('DOMContentLoaded', resolve);
  }
});

export default domReady;
