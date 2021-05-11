export default class Feedback {
  constructor() {
    this.input = document.querySelector('.inputUrl');
    this.form = document.querySelector('.rss-form');
    this.button = document.querySelector('button[aria-label="add"]');
    this.feedback = document.querySelector('.feedback');
  }

  showValidMessage(message, flag) {
    this.feedback.textContent = message;
    this.feedback.classList.toggle('text-danger', !flag);
    this.input.classList.toggle('is-invalid', !flag);
  }

  showResponseMessage(message, flag = true) {
    this.feedback.textContent = message;
    this.feedback.classList.toggle(`${!flag ? 'text-success' : 'text-danger'}`, !flag);
    this.button.toggleAttribute('disabled', flag);
  }
}
