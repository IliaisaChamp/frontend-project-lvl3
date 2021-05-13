import onChange from 'on-change';
import * as _ from 'lodash';
import i18next from 'i18next';
import axios from 'axios';
import parser from './parser';
import schema from './utils/validate';
// import ru from './utils/texts';
import feedbackMessages from './utils/feedback';
import { createFeed, updateFeed } from './views';
import './scss/index.sass';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/alert';

const getRssData = (url) => {
  const originsUlr = `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`;
  return axios.get(originsUlr).then((resolve) => parser(resolve.data));
};

const formState = {
  rssForm: {
    state: null,
  },
};

const model = (rssUrl, responseState, feedback, err) => {
  const watchedFormState = onChange(formState, (path, value) => {
    if (path === 'rssForm.state') {
      if (value === 'invalid') feedback.showValidMessage(i18next.t('feedback.invalid'), false);
      if (value === 'exist') feedback.showValidMessage(i18next.t('feedback.exist'), false);
      if (value === 'empty') feedback.showValidMessage(i18next.t('feedback.empty'), false);
    }
  });

  const watchedResponseState = onChange(responseState, (path, value) => {
    if (path === 'response.state') {
      if (value === 'unsuccess') feedback.showResponseMessage(i18next.t('feedback.unsuccess'));
      if (value === 'parsererror') feedback.showResponseMessage(i18next.t('feedback.parsererror'));
      if (value === 'success') {
        feedback.showResponseMessage(
          i18next.t('feedback.success'),
          true,
          false,
        );
        createFeed(responseState.feeds);
        feedback.resetForm();
      }
      if (value === 'procesing') feedback.showResponseMessage(i18next.t('feedback.loading'), true, true);
      if (value === 'update') updateFeed(responseState.feeds);
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
            responseState.feeds[url].posts,
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
  const responseState = {
    response: {
      state: null,
    },
    feeds: {},
  };
  const feedback = feedbackMessages();

  i18next
    .init({
      lng: 'ru',
      debug: false,
      resources: {
        ru: {
          translation: {
            feedback: {
              invalid: 'Ссылка должна быть валидным URL',
              exist: 'RSS уже существует',
              empty: 'Не должно быть пустым',
              unsuccess: 'Ошибка сети',
              parsererror: 'Ресурс не содержит валидный RSS',
              success: 'RSS успешно загружен',
              loading: 'Загрузка...',
            },
          },
        },
      },
    })
    .then(() => {
      const form = document.querySelector('.rss-form');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const url = formData.get('url');
        url.trim();
        schema
          .validate({ rssUrl: url, input: url })
          .then((resolve) => model(resolve.rssUrl, responseState, feedback))
          .catch((error) => {
            if (error) {
              model(null, responseState, feedback, error);
            }
          });
      });
    });
};

export default initApp;
