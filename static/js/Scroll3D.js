"use strict";

const _LEFT = true;
const _RIGHT = false;

class Scroll3D extends Component {
  constructor(props) {
    super(props);
    this._itemsToDom = this._itemsToDom.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this._getDisplayText = this._getDisplayText.bind(this);
    const total = props.items.length;
    this.step = 2 / total;
    let progress = 0;
    this.items = [];
    for (let item of props.items) {
      this.items.push({
        title: item.title,
        img: item.img,
        progress: progress
      });
      progress += this.step;
      if (progress > 1) {
        progress = -1 + (progress - 1);
      }
    }
    this.imgWidthPercent = 70;
    this.state.scrolling = false;
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
    const minHeight = 30;
    // return (100 - minHeight) * Math.cos((1-Math.abs(progress)) * Math.PI) + minHeight;
    if (progress < -0.5 || progress > 0.5) {
      return minHeight;
    }
    return 100;
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
  _updateProgress(diff) {
    this.items = this.items.map(item=>{
      item.progress = item.progress + (diff / 100);
      if (item.progress > 1) {
        item.progress = -1 + (item.progress - 1);
      }
      if (item.progress < -1) {
        item.progress = 1 + (item.progress + 1);
      }
      return item;
    })
  }
  _evenOut(amount) {
    this.items = this.items.map(item=>{
      item.progress = item.progress + amount;
      if (item.progress > 1) {
        item.progress = -1 + (item.progress - 1);
      }
      if (item.progress < -1) {
        item.progress = 1 + (item.progress + 1);
      }
      return item;
    })
  }
  // TODO handle tap (go one to the left, or one to the right.)
  mouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({scrolling: true, prevX: e.clientX });
  }
  // TODO this aught to animate back to nearest item. It isn't animating right now.
  mouseUp(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({scrolling: false});
    let closest = this._getMinAbsoluteProgress(this.items);
    const rate = 500;
    const amount = -1 * (closest.progress / rate);
    for (let i = rate; i > 0; i--) {
      this._evenOut(amount);
      this.setState({remaining: i})
    }
  }
  mouseMove(e, scrolling, prevX) {
    e.preventDefault();
    e.stopPropagation();
    if (!scrolling) {
      return;
    }
    const diff = e.clientX - prevX;
    this._updateProgress(diff);
    this.setState({prevX: e.clientX});
  }
  _getDisplayText() {
    let itemRight = this._getMinAbsoluteProgress(this.items.filter(x => x.progress <= 0));
    let itemLeft = this._getMinAbsoluteProgress(this.items.filter(x => x.progress >= 0));
    let leftOpacity = 0;
    let rightOpacity = 0;
    if (Math.abs(itemRight.progress) < Math.abs(itemLeft.progress)) {
      rightOpacity = 1 - Math.abs(itemRight.progress);
      leftOpacity = 1 - Math.abs(itemLeft.progress);
    } else {
      leftOpacity = 1 - Math.abs(itemLeft.progress);
      rightOpacity = 1 - Math.abs(itemRight.progress);
    }
    leftOpacity -= (this.step * (1-leftOpacity));
    rightOpacity -= (this.step * (1-rightOpacity));
    return {
      leftOpacity: leftOpacity,
      rightOpacity: rightOpacity,
      leftTitle: itemLeft.title,
      rightTitle: itemRight.title
    }
  }
  render(props, state) {
    
    const {leftOpacity, rightOpacity, leftTitle, rightTitle} = this._getDisplayText();
    return (
      h('div', { className: "Scroll3D", onMouseDown:this.mouseDown, onMouseUp:this.mouseUp, onMouseMove:(e)=>this.mouseMove(e, state.scrolling, state.prevX) },
        this._itemsToDom(),
        h('span', { className: 'title', style: `opacity: ${leftOpacity};` }, leftTitle),
        h('span', { className: 'title', style: `opacity: ${rightOpacity};` }, rightTitle)
      )
    )
  }
}