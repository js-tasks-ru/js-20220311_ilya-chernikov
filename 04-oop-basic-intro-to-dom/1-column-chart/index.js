export default class ColumnChart {
  static #typeArray = ['orders', 'sales', 'customers']
  static  #defaultType = 'orders'

  constructor(options = {}) {
    ({value: this.value = '', data: this.data = [], formatHeading: this.formatHeading = item => item, label: this.label = '', link: this.link, chartHeight: this.chartHeight = 50} = options);
    if (!ColumnChart.#typeArray.includes(this.label)) {this.type = ColumnChart.#defaultType;} else {this.type = this.label;}

    this.render();

  }

  getTemplate () {
    return `
      <div class="dashboard__chart_${this.type}">
        <div class="column-chart" style="--chart-height: ${this.chartHeight}">
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

    if (this.data.length !== 0) {
      wrapper.querySelector('.column-chart__chart').append(...this._formDataColumns(this.data));
    } else {
      wrapper.querySelector('.column-chart').classList.add('column-chart_loading');
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
    this.element = null;
    let p =0;
  }

  destroy () {

  }

  update (dataArray) {
    if (this.data.length === 0) {
      if (dataArray.length === 0) {return;} else {
        this.element.querySelector('.column-chart').classList.remove('column-chart_loading');
      }
    }

    if (dataArray.length === 0) {
      this.element.querySelector('.column-chart').classList.add('column-chart_loading');
      this.data =[];
      return;
    }

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
    const scale = 50 / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }



}
