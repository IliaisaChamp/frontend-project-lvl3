const formHTML = `
  <form action="" class="rss-form"><div class="form-row">
    <div class="col">
      <input autofocus="" required="" name="url" aria-label="url" class="form-control form-control-lg w-100" placeholder="ссылка RSS"></div>
      <div class="col-auto">
        <button type="submit" aria-label="add" class="btn btn-lg btn-primary px-sm-5">Add</button>
      </div>
    </div>
  </form>
`;

export default () => formHTML;
