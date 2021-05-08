import onChange from 'on-change';
import i18next from 'i18next';
import feedView from './views/feeds.view';
import state from './state';

const watchedState = onChange(state, (path, value) => {
  const feedback = document.querySelector('.feedback');
  const input = document.querySelector('.inputUrl');
  const button = document.querySelector('button[aria-label="add"]');

  if (path === 'rssForm.state') {
    if (value === 'invalid') {
      feedback.textContent = i18next.t('feedback.invalid');
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
    }
    if (value === 'exist') {
      feedback.textContent = i18next.t('feedback.exist');
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
    }
  }
  if (path === 'feeds.state') {
    if (value === 'unsuccess') {
      feedback.textContent = i18next.t('feedback.unsuccess');
      feedback.classList.add('text-danger');
    }
    if (value === 'success') {
      feedback.textContent = i18next.t('feedback.success');
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedView();
    }
  }

  if (path === 'request.state') {
    if (value === 'pending') {
      console.log(state);
      button.setAttribute('disabled', true);
    }
    if (value === 'fulfilled') {
      button.removeAttribute('disabled');
    }
  }
});

export default watchedState;
