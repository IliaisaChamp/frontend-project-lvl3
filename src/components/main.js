import form from './form';
import feeds from './feeds';

const mainHtml = `
<div class="modal fade" id="modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      </div>
      <div class="modal-footer"><a class="btn btn-primary full-article" href="" role="button" target="_blank" rel="noopener noreferrer">Читать полностью </a><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button></div>
    </div>
  </div>
</div>
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
