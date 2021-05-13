import i18next from 'i18next';
import schema from './utils/validate';
import model from './main';

const input = document.querySelector('.inputUrl');
const rssForm = document.querySelector('.rss-form');
const button = document.querySelector('button[aria-label="add"]');
const feedbackEl = document.querySelector('.feedback');

const initApp = () => {
  const state = {
    rssForm: {
      state: null,
    },
    response: {
      state: null,
    },
    feeds: {},
  };

  const feedbackMessages = () => {
    const showValidMessage = (message, flag) => {
      feedbackEl.textContent = message;
      feedbackEl.classList.toggle('text-danger', !flag);
      input.classList.toggle('is-invalid', !flag);
    };

    const showResponseMessage = (message, flag = false, isDisabled) => {
      feedbackEl.classList.remove('text-success', 'text-danger');
      feedbackEl.textContent = message;
      feedbackEl.classList.toggle(
        `${flag ? 'text-success' : 'text-danger'}`,
        true,
      );
      button.toggleAttribute('disabled', isDisabled);
      input.toggleAttribute('readonly', isDisabled);
      input.classList.remove('is-invalid');
    };

    const resetForm = () => {
      rssForm.reset();
    };

    return { showValidMessage, showResponseMessage, resetForm };
  };

  const feedback = feedbackMessages();

  i18next
    .init({
      lng: 'ru',
      debug: false,
      resources: {
        ru: {
          translation: {
            feedback: {
              invalid: 'Ссылка должна быть валидным URL',
              exist: 'RSS уже существует',
              empty: 'Не должно быть пустым',
              unsuccess: 'Ошибка сети',
              parsererror: 'Ресурс не содержит валидный RSS',
              success: 'RSS успешно загружен',
              loading: 'Загрузка...',
            },
          },
        },
      },
    })
    .then(() => {
      const form = document.querySelector('.rss-form');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const url = formData.get('url');
        url.trim();
        schema
          .validate({ rssUrl: url, input: url })
          .then((resolve) => model(resolve.rssUrl, state, feedback))
          .catch((error) => {
            if (error) {
              model(null, state, feedback, error);
            }
          });
      });
    });
};

export default initApp;
