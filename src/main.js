import onChange from 'on-change';
import * as _ from 'lodash';
import i18next from 'i18next';
import axios from 'axios';
import parser from './parser';
import schema from './utils/validate';
import ru from './utils/texts';
// import feedbackMessage from './utils/feedback';
import { createFeed, updateFeed } from './views';
import './scss/index.sass';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/alert';

const input = document.querySelector('.inputUrl');
const rssForm = document.querySelector('.rss-form');
const button = document.querySelector('button[aria-label="add"]');
const feedbackEl = document.querySelector('.feedback');

const getRssData = (url) => {
  const originsUlr = `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`;
  return axios.get(originsUlr).then((resolve) => parser(resolve.data));
};

const model = (rssUrl, state, err) => {
  const showValidMessage = (message, flag) => {
    feedbackEl.textContent = message;
    feedbackEl.classList.toggle('text-danger', !flag);
    input.classList.toggle('is-invalid', !flag);
  };

  const showResponseMessage = (message, flag = false, isDisabled) => {
    feedbackEl.classList.remove('text-success', 'text-danger');
    feedbackEl.textContent = message;
    feedbackEl.classList.toggle(`${flag ? 'text-success' : 'text-danger'}`, true);
    button.toggleAttribute('disabled', isDisabled);
    input.toggleAttribute('readonly', isDisabled);
    input.classList.remove('is-invalid');
  };

  const resetForm = () => {
    rssForm.reset();
  };

  const watchedFormState = onChange(state, (path, value) => {
    if (path === 'rssForm.state') {
      if (value === 'invalid') showValidMessage(i18next.t('feedback.invalid'), false);
      if (value === 'exist') showValidMessage(i18next.t('feedback.exist'), false);
      if (value === 'empty') showValidMessage(i18next.t('feedback.empty'), false);
    }
  });

  const watchedResponseState = onChange(state, (path, value) => {
    if (path === 'response.state') {
      if (value === 'unsuccess') showResponseMessage(i18next.t('feedback.unsuccess'));
      if (value === 'parsererror') showResponseMessage(i18next.t('feedback.parsererror'));
      if (value === 'success') {
        showResponseMessage(
          i18next.t('feedback.success'),
          true,
          false,
        );
        createFeed(state.feeds);
        resetForm();
      }
      if (value === 'procesing') showResponseMessage(i18next.t('feedback.loading'), true, true);
      if (value === 'update') updateFeed(state.feeds);
    }
  });

  if (err) {
    watchedFormState.rssForm.state = err.message;
    return;
  }
  if (_.has(watchedResponseState.feeds, rssUrl)) {
    watchedFormState.rssForm.state = 'exist';
    return;
  }
  watchedResponseState.response.state = 'procesing';

  const isEqual = (post1, post2) => (
    post1.title === post2.title && post1.description === post2.description
  );

  const updateFeeds = (url) => {
    setTimeout(() => {
      getRssData(url)
        .then((data) => {
          const diff = _.differenceWith(
            data.posts,
            state.feeds[url].posts,
            isEqual,
          );
          if (!_.isEmpty(diff)) {
            watchedResponseState.feeds[url] = data;
            watchedResponseState.response.state = 'update';
          }
        })
        .catch((error) => {
          if (error) {
            watchedResponseState.response.state = 'unsuccess';
          }
        })
        .finally(() => {
          updateFeeds(url);
        });
    }, 5000);
  };

  getRssData(rssUrl)
    .then((data) => {
      watchedResponseState.feeds[rssUrl] = data;
      watchedResponseState.response.state = 'success';
      updateFeeds(rssUrl);
    })
    .catch((error) => {
      if (error.message === 'parsererror') {
        watchedResponseState.response.state = error.message;
      } else {
        watchedResponseState.response.state = 'unsuccess';
      }
    });
};

const initApp = () => {
  const state = {
    rssForm: {
      state: null,
    },
    response: {
      state: null,
    },
    feeds: {},
  };

  i18next.init({ lng: 'ru', debug: true, resources: { ru } }).then(() => {
    const form = document.querySelector('.rss-form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const url = formData.get('url');
      url.trim();
      schema
        .validate({ rssUrl: url, input: url })
        .then((resolve) => model(resolve.rssUrl, state))
        .catch((error) => {
          if (error) {
            model(null, state, error);
          }
        });
    });
  });
};

export default initApp;
