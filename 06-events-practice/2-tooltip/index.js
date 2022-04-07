class Tooltip {
  static instancepointer = null
  static isInitialized = false
  onPointerOver = event => {
    const target = event.target;
    if (!event.target.dataset.tooltip) {return;}

    this.element.style.opacity = '1';
    document.addEventListener('pointermove', this.onPointerMove);
    this.element.textContent = event.target.dataset.tooltip;
  }
  onPointerOut = event =>{
    this.element.style.opacity = '0';
    document.removeEventListener('pointermove', this.onPointerMove);
  }
  onPointerMove = event =>{
    this.moveAt(event.pageX, event.pageY);
  }

  constructor() {
    if (Tooltip.instancepointer) {return Tooltip.instancepointer;}

    this.render();
    Tooltip.instancepointer = this;
  }

  initialize () {
    if(Tooltip.isInitialized) {return;}
    document.body.appendChild(this.element);
    this.initEvents();
  }

  render () {
    const div = document.createElement('div');
    div.innerHTML = `<div class="tooltip">This is tooltip</div>`;
    this.element = div.firstElementChild;
    this.element.style.opacity = '0';

  }

  destroy () {
    this.remove();
    this.element = null;
    Tooltip.instancepointer = null;
    Tooltip.isInitialized = false;
  }

  remove () {
    this.element.remove();
  }
  initEvents () {
    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);
  }

  moveAt(pageX, pageY) {
    this.element.style.left = pageX - this.element.offsetWidth / 2 + 'px';
    this.element.style.top = pageY + this.element.offsetHeight / 2 + 'px';
  }


}

export default Tooltip;
