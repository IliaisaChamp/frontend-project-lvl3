import schema from './utils/validate';
import model from './model';
import './scss/index.sass';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/alert';

export default () => {
  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const url = formData.get('url');
    url.trim();
    schema
      .validate({ rssUrl: url })
      .then((resolve) => model(resolve.rssUrl))
      .catch((err) => {
        if (err) {
          model(null, err);
        }
      });
  });
};
