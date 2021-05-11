import * as _ from 'lodash';

const addModalInfo = (data) => {
  const buttons = document.querySelectorAll('[data-bs-target="#modal"]');

  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const { id } = e.target.dataset;
      const { url } = e.target.dataset;
      const { title, description, link } = data[url].posts[id - 1];
      const modal = document.querySelector('#modal');
      modal.querySelector('.modal-title').textContent = title;
      modal.querySelector('.modal-body').textContent = description;
      modal.querySelector('a').href = link;
    });
  });
};

const addArticlesToList = (posts, url) => {
  const createArticle = (post, id) => {
    const link = `<a href="${post.link}" class="font-weight-bold" data-id="" target="_blank" rel="noopener noreferrer">${post.title}</a>`;
    const button = `<button type="button" class="btn btn-primary btn-sm" data-id="${id + 1}" data-url="${url}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
    return `<li class="list-group-item d-flex justify-content-between align-items-start">${link}${button}</li>`;
  };

  const listItems = posts.map(createArticle);
  return listItems.join('');
};

const addFeedsToList = (feeds) => {
  const { title, description } = feeds;
  return `<li class="list-group-item"><h3>${title}</h3><p>${description}</p></li>`;
};

const createFeed = (data) => {
  const keys = _.keys(data);
  keys.reverse();
  const feedsContainer = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');

  feedsContainer.innerHTML = `<h2>Фиды</h2><ul class="list-group mb-5">${keys
    .map((url) => addFeedsToList(data[url]))
    .join('')}</ul>`;
  postsContainer.innerHTML = `<h2>Посты</h2><ul class="list-group mb-5">${keys
    .map((url) => addArticlesToList(data[url].posts, url))
    .join('')}</ul>`;
  addModalInfo(data);
};

const updateFeed = (data) => {
  createFeed(data);
};

export { createFeed, updateFeed, addFeedsToList };
