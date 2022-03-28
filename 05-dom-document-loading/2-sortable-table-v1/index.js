export default class SortableTable {
  static defaultTemplate = function (itemObj) {
    return `<div class="sortable-table__cell">${itemObj[this.id]}</div>`;
  }


  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    for (const confEl of this.headerConfig) {
      if (!confEl.template) { confEl.template = SortableTable.defaultTemplate;}
    }
    this.data = data;

    this.render();
  }

  render () {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.elementBodyLink = element.querySelector('.sortable-table__body');
    this.elementBodyLink.innerHTML = this.getTemplateTableBody(this.data);
    this.element = element.firstElementChild;
  }

  sort (fieldValue, orderValue) {
    const directions = {
      asc: 1,
      desc: -1
    };

    const direction = directions[orderValue];
    this.elementBodyLink.innerHTML = this.getTemplateTableBody([...this.data].sort((a, b) =>{
      return direction * this.sortByType(this.getSortType(fieldValue), a[fieldValue], b[fieldValue]);
    }));
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
    return this.headerConfig.reduce((value, item) =>{
      return value + `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="asc">
            <span>${item.title}</span>
        </div>
      `;
    }, '');
  }

  getTemplateTableBody (sortedData) {
    return sortedData.reduce((value, item) =>{
      return value + `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.headerConfig.reduce((valueConf, itemConf) => {
            return valueConf + itemConf.template(item);
          }, '')}
        </a>
      `;
    }, '');
  }

  getSortType (field) {
    for (const f of this.headerConfig) {
      if (f.id === field) {
        if (f.sortable) {return f.sortType}
      }
    }
  }

  sortByType (type, a, b) {
    if (type === 'number') {return a - b;}
    if (type === 'string') {return a.localeCompare(b, ['ru', 'en'], {'caseFirst': 'upper'});}
  }

}
