const parser = new DOMParser();

export default (string) => {
  const doc = parser.parseFromString(string, 'application/xml');
  return doc;
};
