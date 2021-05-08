import form from './form';
import feeds from './feeds';

const mainHtml = `
<main class="flex-grow-1">
  <section class="container-fluid bg-dark p-5">
    <div class="row">
      <div class="col-md-10 col-lg-8 mx-auto text-white">
        <h1 class="display-3">RSS агрегатор</h1>
        ${form()}
        <p class="text-secondary my-1">Пример: https://ru.hexlet.io/lessons.rss</p>
        <div class="feedback text-success"></div>
      </div>
    </div>
  </section>
  ${feeds()}
</main>
`;
export default () => mainHtml;
