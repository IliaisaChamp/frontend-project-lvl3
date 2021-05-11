import onChange from 'on-change';
import * as _ from 'lodash';
import i18next from 'i18next';
import axios from 'axios';
import parser from './parser';
import Feedback from './Feedback.js';
import state from './state';
import ru from './utils/ru';
import { createFeed, updateFeed } from './views';

const getRssData = (url) => {
  const originsUlr = `https://hexlet-allorigins.herokuapp.com/raw?url=${url}`;
  return axios.get(originsUlr).then((resolve) => parser(resolve.data));
};

i18next.init({ lng: 'ru', debug: false, resources: { ru } }, (t) => t);

export default (rssUrl, err) => {
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
      getRssData(url).then((data) => {
        const diff = _.differenceWith(data.posts, state.feeds[url].posts, isEqual);
        if (!_.isEmpty(diff)) {
          state.feeds[url] = data;
          watchedResponseState.response.state = 'update';
          console.log(state.feeds[url].posts);
        }
      }).finally(() => {
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
