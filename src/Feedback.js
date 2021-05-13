const input = document.querySelector('.inputUrl');
const form = document.querySelector('.rss-form');
const button = document.querySelector('button[aria-label="add"]');
const feedback = document.querySelector('.feedback');

const showValidMessage = (message, flag) => {
  feedback.textContent = message;
  feedback.classList.toggle('text-danger', !flag);
  input.classList.toggle('is-invalid', !flag);
};

const showResponseMessage = (message, flag = false, isDisabled) => {
  feedback.classList.remove('text-success', 'text-danger');
  feedback.textContent = message;
  feedback.classList.toggle(`${flag ? 'text-success' : 'text-danger'}`, true);
  button.toggleAttribute('disabled', isDisabled);
  input.toggleAttribute('readonly', isDisabled);
  input.classList.remove('is-invalid');
};

const resetForm = () => {
  form.reset();
};

export { showValidMessage, resetForm, showResponseMessage };
