import i18next from 'i18next';
import './scss/index.sass';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/alert';
import formController from './controllers/form';
import ru from './utils/ru';

export default () => {
  formController();
  i18next.init(
    {
      lng: 'ru',
      debug: false,
      resources: {
        ru,
      },
    },
    (err) => {
      if (err) throw err;
    },
  );
};
