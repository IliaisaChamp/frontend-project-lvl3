export default (rssData) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rssData.contents, 'application/xml');

  const parsererror = doc.querySelector('parsererror');
  if (parsererror) {
    throw new Error('parsererror');
  }

  const title = doc.querySelector('channel title').textContent;
  const description = doc.querySelector('channel description').textContent;
  const posts = [...doc.querySelectorAll('item')]
    .map((node) => ({
      title: node.querySelector('title').textContent,
      description: node.querySelector('description').textContent,
      link: node.querySelector('link').textContent,
    }));

  return { title, description, posts };
};
