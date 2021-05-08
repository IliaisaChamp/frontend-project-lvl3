import i18next from 'i18next';
import './scss/index.sass';
import main from './components/main';
import formController from './controllers/form';
import ru from './utils/ru';

export default () => {
  i18next
    .init({
      lng: 'ru',
      resources: {
        ru,
      },
    })
    .then(() => {
      const point = document.querySelector('#point');
      point.innerHTML = main();

      formController();
    });
};
