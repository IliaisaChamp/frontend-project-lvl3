const domReady = () => new Promise((resolve) => {
  if (document.readyState === 'complete' || document.readyState === 'loaded') {
    resolve();
  } else {
    document.addEventListener('DOMContentLoaded', resolve);
  }
});

const isEqual = (post1, post2) => (
  post1.title === post2.title && post1.description === post2.description
);

export { domReady, isEqual };
