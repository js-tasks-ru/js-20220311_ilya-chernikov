import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';
// import {stat} from "@babel/core/lib/gensync-utils/fs";

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  constructor (productId) {
    this.productId = productId;
  }

  async render () {
    const div = document.createElement('div');
    let productData = {};

    if (this.productId) {
      productData = await fetch(`${BACKEND_URL}/api/rest/products?id=${this.productId}`).then(resp => resp.json());
      productData = productData[0];
    }
    div.innerHTML = await this.getTemplate(productData);
    this.element = div.firstElementChild;
  }

  getImagesTemplate (imagesArray) {
    if (!imagesArray) return '';

    return imagesArray.map(item =>{
      return `
        <li class="products-edit__imagelist-item sortable-list__item">
          <input type="hidden" name="url" value="${item.url}">
          <input type="hidden" name="source" value="${item.source}">
          <span>
            <img src="/assets/icons/icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src="${item.url}">
            <span>${item.source}</span>
          </span>
          <button type="button">
            <img src="/assets/icons/icon-trash.svg" data-delete-handle="" alt="delete">
          </button>
      </li>
      `;
    }).join('');
  }

  async getCategotiesTemplate () {
    const response = await fetch(`${BACKEND_URL}/api/rest/categories?_sort=weight&_refs=subcategory`).then(resp => resp.json());
    return response.map(item => {
      return item.subcategories.map(subcategory => {
        return `
           <option value="${subcategory.id}">${item.title} &gt; ${subcategory.title}</option>
        `;
      }).join('');
    }).join('');
  }

  getProductStatus (status) {
    if (status) {
      return `
        <option selected value="1">Активен</option>
        <option value="0">Неактивен</option>
      `;
    } else {
      return `
        <option value="1">Активен</option>
        <option selected value="0">Неактивен</option>
      `;
    }
  }

  async getTemplate(productData) {
    return `
      <div class="product-form">
    <form data-element="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" name="title" class="form-control" placeholder="Название товара" value ='${productData.title || ''}'>  </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${productData.description || ''}</textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer">
          <ul class="sortable-list">
           ${this.getImagesTemplate(productData.images)}
          </ul>
        </div>
        <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" name="subcategory">
            ${await this.getCategotiesTemplate()}
        </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" name="price" class="form-control" placeholder="100" value="${productData.price || ''}"> </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" name="discount" class="form-control" placeholder="0" value="${productData.discount || ''}"> </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" name="quantity" placeholder="1" value="${productData.quantity || ''}"> </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" name="status">
          ${this.getProductStatus(productData.status)}
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline"> Сохранить товар </button>
      </div>
    </form>
  </div>
    `;
  }

  destroy () {
    this.remove();
    this.element = null;
  }

  remove () {
    this.element.remove();
  }
}
