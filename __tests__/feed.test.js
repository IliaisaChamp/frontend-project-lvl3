import { addFeedsToList } from '../src/views.js';

const data = {
  title: 'Test',
  description: 'test desc',
};

it('renders correctly', () => {
  expect(addFeedsToList(data)).toMatchSnapshot();
});
