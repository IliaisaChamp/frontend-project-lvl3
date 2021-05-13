import * as yup from 'yup';

export default yup.object({
  rssUrl: yup.string().url('invalid'),
  input: yup.string().required('empty'),
});
