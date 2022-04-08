import fetchJson from './utils/fetch-json.js';

export default class ColumnChart {

  constructor(options = {}) {
    ({url: this.url, value: this.value = 0, data: this.data = [], formatHeading: this.formatHeading = item => item, label: this.label = '', link: this.link, chartHeight: this.chartHeight = 50} = options);
    this.type = this.label || DEFAULT_TYPE;
    this.render();
    if (options.url) {this.fetchData(options.range.from, options.range.to, this.url);}

  }

  getTemplate () {
    return `
      <div class="dashboard__chart_${this.type}">
        <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
            <div class="column-chart__title">
                 Total ${this.label}
            </div>
             <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
                <div data-element="body" class="column-chart__chart"> </div>
             </div>
        </div>
      </div>
    `;
  }

  render () {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();

    if (this.data.length) {
      wrapper.querySelector('.column-chart__chart').append(...this._formDataColumns(this.data));
      wrapper.querySelector('.column-chart').classList.remove('column-chart_loading');
    }


    if (this.link) {
      const link = document.createElement('a');
      link.href = this.link;
      link.innerText = "View all";
      link.classList.add('column-chart__link');
      wrapper.querySelector('.column-chart__title').append(link);
    }

    this.element = wrapper.firstElementChild;


  }

  remove () {
    this.element.remove();
  }

  destroy () {
    this.element = null;
  }

  fetchData (from = new Date(), to = new Date(), url = this.url) {
    fetchJson(`${BACKEND_URL}/${url}?` + new URLSearchParams({
      'from': from.toISOString(),
      'to': to.toISOString()
    })).then(data => this.update(Object.values(data)));

  }


  update (...args) {
    this.element.querySelector('.column-chart').classList.add('column-chart_loading');
    if (!args.length) {
      this._fetchData();
      return;
    }
    if (args[0] instanceof Array) {
      this._update(args[0]);
      return;
    }
    if (args[0] instanceof Date) {
      this.fetchData(...args);
    }

  }

  _update (dataArray) {
    this.element.querySelector('.column-chart').classList.remove('column-chart_loading');
    const chartElement = this.element.querySelector('.column-chart__chart');
    chartElement.replaceChildren(...this._formDataColumns(dataArray));
    this.data = dataArray;
  }

  _formDataColumns(data) {
    const propsArray = this._getColumnProps(data);

    return propsArray.map(item =>{
      const div = document.createElement('div');
      div.setAttribute("style", `--value:${item.value}`);
      div.dataset.tooltip = item.percent;
      return div;
    });
  }

  _getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }


}

const BACKEND_URL = 'https://course-js.javascript.ru';
const   DEFAULT_TYPE = 'order';
