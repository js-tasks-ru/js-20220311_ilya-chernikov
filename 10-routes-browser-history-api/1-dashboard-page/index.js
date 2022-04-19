import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  constructor() {
    this.render();
  }

  async render () {
    this.componentsObject = {
      sales: new ColumnChart(defaultSalesChartFotmat),
      orders: new ColumnChart(defaultOrdersChartFormat),
      customers: new ColumnChart(defaultCustomersChartFormat),
      sortTable: new SortableTable(header, defaultSortTableChartFormat)
    };

    const promisesList = Object.entries(this.componentsObject).map(([componentName, componentValue]) => {
      return componentValue.fetchData().then(result =>{
        return {
          component: componentName,
          data: result
        };
      });
    });

    const responseDataArray = await Promise.all(promisesList);
    for (const result of responseDataArray) {
      this.componentsObject[result.component].update(result.data);
    }

    this.componentsObject.rangePicker = new RangePicker();
    const div = document.createElement('div');
    div.innerHTML = this.getTemplate();
    this.element = div.firstElementChild;
    document.getElementsByClassName('progress-bar')[0].style.display = 'none';
    return this.element;
  }

  getTemplate () {
    return `
    <div class="dashboard full-height flex-column">
          <div class="content__top-panel"><h2 class="page-title">Панель управления</h2><div class="rangepicker">
            ${this.componentsObject.rangePicker.element.outerHTML}
            <div class="rangepicker__selector" data-elem="selector"></div>
          </div>
        </div>
        <div class="dashboard__charts">
            ${this.getChatrtsTemplate()}
        </div>
        <h3 class="block-title">Лидеры продаж</h3>
        ${this.componentsObject.sortTable.element.outerHTML}

    </div>
    `;
  }

  getChatrtsTemplate () {
    return Object.values(this.componentsObject).map(component => {
      if (component instanceof ColumnChart) {
        return component.element.outerHTML;
      }
    }).join('');
  }

}

const defaultSalesChartFotmat = {
  url: 'api/dashboard/sales',
  label: 'sales',
  formatHeading: data => `$${data}`,
  immediateFetch: false,
  range: {
    from: new Date('2020-04-06'),
    to: new Date('2020-05-06'),
  },
};

const defaultOrdersChartFormat = {
  url: 'api/dashboard/orders',
  label: 'orders',
  link: '#',
  immediateFetch: false,
  range: {
    from: new Date('2020-04-06'),
    to: new Date('2020-05-06'),
  },
};

const defaultCustomersChartFormat = {
  url: 'api/dashboard/customers',
  label: 'customers',
  immediateFetch: false,
  range: {
    from: new Date('2020-04-06'),
    to: new Date('2020-05-06'),
  },
};

const defaultSortTableChartFormat = {url: 'api/dashboard/bestsellers', immediateFetch: false, isSortLocally: true};

