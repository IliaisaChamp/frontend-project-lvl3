import i18next from 'i18next';
import './scss/index.sass';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/alert';
import main from './components/main';
import formController from './controllers/form';
import ru from './utils/ru';

export default () => {
  i18next.init(
    {
      lng: 'ru',
      debug: true,
      resources: {
        ru,
      },
    },
    (err, t) => {
      const point = document.querySelector('#point');
      point.innerHTML = main();

      formController();
    },
  );
};
