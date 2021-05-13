const input = document.querySelector('.inputUrl');
const form = document.querySelector('.rss-form');
const button = document.querySelector('button[aria-label="add"]');
const feedbackEl = document.querySelector('.feedback');

const feedback = {
  showValidMessage(message, flag) {
    feedbackEl.textContent = message;
    feedbackEl.classList.toggle('text-danger', !flag);
    input.classList.toggle('is-invalid', !flag);
  },

  showResponseMessage(message, flag = false, isDisabled) {
    feedbackEl.classList.remove('text-success', 'text-danger');
    feedbackEl.textContent = message;
    feedbackEl.classList.toggle(`${flag ? 'text-success' : 'text-danger'}`, true);
    button.toggleAttribute('disabled', isDisabled);
    input.toggleAttribute('readonly', isDisabled);
    input.classList.remove('is-invalid');
  },

  resetForm() {
    form.reset();
  },
};

export default feedback;
