import schema from '../utils/validate';
import model from '../model/model';

export default () => {
  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { url } = form.elements;

    schema
      .validate({ rssUrl: url.value.trim() })
      .then((resolve) => {
        const rssUrl = resolve.rssUrl.trim();
        model(rssUrl);
      })
      .catch((err) => {
        if (err) {
          model(null, err);
        }
      });
  });
};
