"use strict";

const _LEFT = true;
const _RIGHT = false;

class Scroll3D extends Component {
  constructor(props) {
    super(props);
    this._itemsToDom = this._itemsToDom.bind(this);
    const total = props.items.length;
    const step = 2 / total;
    let progress = 0;
    this.items = [];
    for (let item of props.items) {
      this.items.push({
        title: item.title,
        img: item.img,
        progress: progress
      });
      progress += step;
      if (progress > 1) {
        progress = -1 + (progress - 1);
      }
    }
    console.log(this.items)
    this.imgWidthPercent = 70;
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  handleScroll(event) {
    console.log(event);
  }
  _getMinAbsoluteProgress(items) {
    let least = { progress: 1 };
    for (let item of items) {
      if (Math.abs(item.progress) < Math.abs(least.progress)) {
        least = item;
      }
    }
    return least;
  }
  _progressToXOffset(progress) {
    const maxOffset = 80;
    return maxOffset * Math.sin(progress * Math.PI);
  }
  _progressToHeight(progress) {
    const minHeight = 40;
    return (100 - minHeight) * Math.cos((1-Math.abs(progress)) * Math.PI) + minHeight;
  }
  _itemsToDom(props) {
    return this.items.map(item =>{
      let xOffset = this._progressToXOffset(item.progress);
      let left = xOffset > 0 ? xOffset : 0;
      let width = xOffset > 0 ? 100 - left : 100 + xOffset;
      let height = this._progressToHeight(item.progress);
      return h('div', {
        className: "item",
        style: `
            left: ${left}%;
            width: ${width}%;
            height: ${height}%;
          `
        },
        h('img', {
          src: item.img,
          style: `
            max-height: ${this.imgWidthPercent}%;
            max-width: ${this.imgWidthPercent}%;
          `
        })
      )
    });
  }
  render(props, state) {
    let itemRight = this._getMinAbsoluteProgress(this.items.filter(x => x.progress <= 0));
    let itemLeft = this._getMinAbsoluteProgress(this.items.filter(x => x.progress >= 0));
    let TITLE = null;
    if (itemRight == itemLeft) {
      TITLE = itemRight.title;
    }
    return (
      h('div', { className: "Scroll3D" },
        this._itemsToDom(),
        TITLE ? h('span', { className: 'title', style: 'opacity: 1;' }, TITLE)
          : h('span', { className: 'title', style: `opacity: ${Math.abs(1 - itemLeft.progress)};` }, itemLeft.title),
        TITLE ? null : h('span', { className: 'title', style: `opacity: ${Math.abs(1 - itemRight.progress)};` }, itemRight.title)
      )
    )
  }
}