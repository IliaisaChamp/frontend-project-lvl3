import state from '../state';

const makeFeedList = () => {
  let lists = '';
  state.feeds.feedsList.forEach((list) => {
    lists += `
      <li class="list-group-item">
        <h3>${list.title}</h3>
        <p>${list.description}</p>
        </li>
    `;
  });
  return lists;
};
const makePostList = () => {
  let list = '';
  state.feeds.posts.forEach((postsArr) => {
    postsArr.forEach((item, id) => {
      list += `
      <li class="list-group-item d-flex justify-content-between align-items-start">
        <a href="${item.querySelector('link').textContent}" class="font-weight-bold" 
        data-id="${id + 1}" target="_blank" rel="noopener noreferrer">${item.querySelector('title').textContent}</a>
        <button type="button" class="btn btn-primary btn-sm" data-id="${id + 1}" data-toggle="modal" data-target="#modal">Просмотр</button>
      </li>
      `;
    });
  });
  return list;
};

export default () => {
  const feeds = document.querySelector('.feeds');
  const posts = document.querySelector('.posts');

  feeds.innerHTML = `
    <h2>Фиды</h2>
    <ul class="list-group mb-5">
      ${makeFeedList()}
    </ul>
  `;

  posts.innerHTML = `
    <h2>Посты</h2>
    <ul class="list-group">
      ${makePostList()}
    </ul>
  `;
};
