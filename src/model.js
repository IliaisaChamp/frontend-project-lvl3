import onChange from 'on-change';
import * as _ from 'lodash';
import i18next from 'i18next';
import axios from 'axios';
import parser from './parser';
import schema from './utils/validate';
import Feedback from './Feedback.js';
import state from './state';
import ru from './utils/ru';
import { createFeed, updateFeed } from './views';
import './scss/index.sass';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/alert';

const getRssData = (url) => {
  const originsUlr = `https://hexlet-allorigins.herokuapp.com/raw?url=${url}`;
  return axios.get(originsUlr).then((resolve) => parser(resolve.data));
};

i18next.init({ lng: 'ru', debug: false, resources: { ru } }, (t) => t);

// export default () => {
const feedback = new Feedback();

const watchedFormState = onChange(state, (path, value) => {
  if (path === 'rssForm.state') {
    if (value === 'invalid') feedback.showValidMessage(i18next.t('feedback.invalid'), false);
    if (value === 'exist') feedback.showValidMessage(i18next.t('feedback.exist'), false);
  }
});

const watchedResponseState = onChange(state, (path, value) => {
  if (path === 'response.state') {
    if (value === 'unsuccess') feedback.showResponseMessage(i18next.t('feedback.unsuccess'), false);
    if (value === 'success') {
      feedback.showResponseMessage(i18next.t('feedback.success'), false);
      createFeed(state.feeds);
    }
    if (value === 'procesing') feedback.showResponseMessage(i18next.t('feedback.loading'), true);
    if (value === 'update') updateFeed(state.feeds);
  }
});

const model = (rssUrl, err) => {
  if (err) {
    watchedFormState.rssForm.state = 'invalid';
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
            state.feeds[url] = data;
            watchedResponseState.response.state = 'update';
            console.log(state.feeds[url].posts);
          }
        })
        .finally(() => {
          updateFeeds(url);
        });
    }, 5000);
  };

  getRssData(rssUrl)
    .then((data) => {
      state.feeds[rssUrl] = data;
      watchedResponseState.response.state = 'success';
      updateFeeds(rssUrl);
    })
    .catch((error) => {
      if (error) {
        watchedResponseState.response.state = 'unsuccess';
      }
    });
};
export default () => {
  i18next.init({ lng: 'ru', debug: false, resources: { ru } }).then(() => {
    const form = document.querySelector('.rss-form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const url = formData.get('url');
      url.trim();
      schema
        .validate({ rssUrl: url })
        .then((resolve) => model(resolve.rssUrl))
        .catch((error) => {
          if (error) {
            model(null, error);
          }
        });
    });
  });
};
