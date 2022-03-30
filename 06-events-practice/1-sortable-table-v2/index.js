export default class SortableTable {
  onArrowLink = null

  constructor(headerConfig, {
    data = [],
    sorted = {},
    isSortLocally = true
  } = {}) {
    this.headerConfig = headerConfig;
    this.parseConfig();
    this.data = data;
    this.isSortLocally = isSortLocally;
    this.defaultSort = sorted;

    this.render();
    this.initEventListeners();
  }

  render () {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.elementBodyLink = element.querySelector('.sortable-table__body');
    this.sort();
    this.element = element.firstElementChild;
  }

  initEventListeners () {
    document.addEventListener("DOMContentLoaded", () =>{
      if (!this.onArrowLink) {
        this.onArrowLink = document.querySelector(`[data-id=${this.defaultSort.id}] .sortable-table__sort-arrow`);
        if (this.onArrowLink) {
          this.onArrowLink.style.opacity = 1;
        } else {
          this.onArrowLink = document.querySelector('.sortable-table__sort-arrow');
        }

      }
      const columnsArray = document.querySelectorAll('.sortable-table__header .sortable-table__cell');

      for (let column of columnsArray) {
        column.addEventListener('pointerdown', (event) =>{
          if (event.target.nodeName !== 'SPAN') {
            return;
          }

          const divColumnElem = event.target.parentNode;
          if (divColumnElem.dataset.sortable === 'false') {return;}

          this.sort(divColumnElem.dataset.id, divColumnElem.dataset.order);
          if (divColumnElem.dataset.order === 'asc') {
            divColumnElem.dataset.order = 'desc';
          } else if (divColumnElem.dataset.order === 'desc') {
            divColumnElem.dataset.order = 'asc';
          }

          const newArrowLink = divColumnElem.querySelector('.sortable-table__sort-arrow');
          if (newArrowLink !== this.onArrowLink) {
            newArrowLink.style.opacity = 1;
            this.onArrowLink.style.opacity = 0;
            this.onArrowLink = newArrowLink;
          }



        });
      }
    });
  }

  sort (fieldValue = this.defaultSort.id, orderValue = this.defaultSort.order, isSortLocally = this.isSortLocally) {
    if (!fieldValue) {
      this.elementBodyLink.innerHTML = this.getTemplateTableBody(this.data);
      return;
    }

    if (isSortLocally) {
      this.sortOnClient(fieldValue, orderValue);
    } else {
      this.sortOnServer(fieldValue, orderValue);
    }

  }

  sortOnClient (fieldValue, orderValue) {
    const directions = {
      asc: 1,
      desc: -1
    };

    const direction = directions[orderValue];
    this.elementBodyLink.innerHTML = this.getTemplateTableBody([...this.data].sort((a, b) =>{
      return direction * this.sortByType(this.getSortType(fieldValue), a[fieldValue], b[fieldValue]);
    }));
  }

  sortOnServer (fieldValue, orderValue) {
    //
  }



  remove () {
    this.element.remove();
  }

  destroy () {
    this.remove();
    this.element = null;
    this.elementBodyLink = null;
  }

  getTemplate () {
    return `
    <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.getTemplateTableHeader()}
            </div>

            <div data-element="body" class="sortable-table__body">

            </div>
        </div>
     </div>
    `;
  }

  getTemplateTableHeader () {
    return this.headerConfig.map(item => {
      return `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order=${this.defaultSort.order || 'asc'}>
            <span>${item.title}</span>
            ${this.getArrowSpan(item.sortable)}
        </div>
      `;
    }).join('');
  }

  getTemplateTableBody (sortedData) {
    return sortedData.map(item =>{
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.headerConfig.map(itemConf => {
        return itemConf.template(item);
      }).join('')}
        </a>
      `;
    }).join('');
  }

  getSortType (field) {
    for (const item of this.headerConfig) {
      if (item.id === field) {
        if (item.sortable) {
          return item.sortType;
        }
      }
    }

  }

  sortByType (type, a, b) {
    if (type === 'number') {return a - b;}
    if (type === 'string') {return a.localeCompare(b, ['ru', 'en'], {'caseFirst': 'upper'});}
  }

  getDefaultTemplate (itemObj) {
    return `<div class="sortable-table__cell">${itemObj[this.id]}</div>`;
  }

  parseConfig () {
    for (const confEl of this.headerConfig) {
      if (!confEl.template) {
        confEl.template = this.getDefaultTemplate;
      }
    }

  }

  getArrowSpan (sortable) {
    if (sortable) {
      return `
        <span data-element="arrow" class="sortable-table__sort-arrow" style="opacity: 0">
          <span class="sort-arrow"></span>
        </span>
      `;
    }
    else {
      return '';
    }
  }




}
