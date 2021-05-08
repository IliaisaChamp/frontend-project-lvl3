import axios from 'axios';
import watchedState from '../observer';
import parser from '../utils/parser';

export default (rssUrl, err) => {
  watchedState.feeds.state = '';
  if (err) {
    watchedState.rssForm.state = 'invalid';
    return;
  }
  if (watchedState.feeds.urls.indexOf(rssUrl) !== -1) {
    watchedState.rssForm.state = 'exist';
    return;
  }
  watchedState.feeds.urls.push(rssUrl);

  const originsUlr = `https://hexlet-allorigins.herokuapp.com/raw?url=${rssUrl}`;

  axios
    .get(originsUlr)
    .then((resolve, reject) => {
      watchedState.request.state = 'pending';
      if (resolve.status === 200) {
        return parser(resolve.data);
      }
      return reject;
    })
    .then((doc) => {
      watchedState.request.state = 'fulfilled';

      const title = doc.documentElement.querySelector('channel>title').textContent;
      const description = doc.documentElement.querySelector('channel>description').textContent;
      const items = doc.documentElement.querySelectorAll('channel>item');

      watchedState.feeds.feedsList.unshift({ title, description });
      watchedState.feeds.posts.unshift(items);
      watchedState.feeds.state = 'success';
    })
    .catch((error) => {
      if (error) {
        console.log(error);
        watchedState.feeds.state = 'unsuccess';
      }
    });
};
