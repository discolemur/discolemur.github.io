"use strict";

const _LEFT = true;
const _RIGHT = false;
const _ANIMATE_RATE = 200;

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
    this.state.items = [];
    for (let item of props.items) {
      this.state.items.push({
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
    this.direction = _RIGHT;
    this.directions = [];
  }
  _addRecentDirection(dir) {
    if (this.directions.length == 3) {
      this.directions.splice(0,1);
    }
    this.directions.push(dir == _LEFT ? 1 : 0);
    let sum = 0;
    this.directions.forEach(val=>sum+=val)
    sum /= this.directions.length;
    if (sum > 0.5) {
      this.direction = _LEFT;
    } else if (sum < 0.5) {
      this.direction = _RIGHT;
    }
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
  _itemsToDom(items) {
    return items.map(item =>{
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
          onClick: (e)=>{e.preventDefault(); e.stopPropagation(); this._evenOut(-1 * item.progress, items);},
          style: `
            max-height: ${this.imgWidthPercent}%;
            max-width: ${this.imgWidthPercent}%;
          `
        })
      )
    });
  }
  _updateProgress(diff, items) {
    items = items.map(item=>{
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
  _evenOut(distance, items) {
    const amount = distance / _ANIMATE_RATE;
    const moveABit = () => {
      items = items.map(item=>{
        item.progress = item.progress + amount;
        if (item.progress > 1) {
          item.progress = -1 + (item.progress - 1);
        }
        if (item.progress < -1) {
          item.progress = 1 + (item.progress + 1);
        }
        return item;
      })
      this.setState({items: items})
    }
    for (let i = _ANIMATE_RATE; i > 0; i--) {
      window.setTimeout(moveABit,1);
    }
  }
  mouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({scrolling: true, prevX: e.clientX });
  }
  mouseUp(e, items) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({scrolling: false});
    let closest =  this._getMinAbsoluteProgress(items);
    let closestLeft = this._getMinAbsoluteProgress(items.filter(item=>item.progress<=0));
    let closestRight = this._getMinAbsoluteProgress(items.filter(item=>item.progress>=0));
    const diff = Math.abs(Math.abs(closestLeft.progress) - Math.abs(closestRight.progress));
    if (diff < (this.step * 0.7) ) {
      if (this.direction == _LEFT) {
        closest = closestRight;
      } else {
        closest = closestLeft;
      }
    }
    const amount = -1 * (closest.progress);
    this._evenOut(amount, items);
  }
  mouseMove(e, scrolling, prevX, items) {
    e.preventDefault();
    e.stopPropagation();
    if (!scrolling) {
      return;
    }
    const diff = e.clientX - prevX;
    if (diff < 0) this._addRecentDirection(_LEFT);
    if (diff > 0) this._addRecentDirection(_RIGHT);
    this._updateProgress(diff, items);
    this.setState({prevX: e.clientX});
  }
  _getDisplayText(items) {
    let itemRight = this._getMinAbsoluteProgress(items.filter(x => x.progress <= 0));
    let itemLeft = this._getMinAbsoluteProgress(items.filter(x => x.progress >= 0));
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
  // TODO handle evening out here using state instead of how we're doing it.
  render(props, state) {
    const {leftOpacity, rightOpacity, leftTitle, rightTitle} = this._getDisplayText(state.items);
    return (
      h('div', {
        className: "Scroll3D",
        onMouseDown:this.mouseDown,
        onMouseUp:(e)=>this.mouseUp(e, state.items),
        onMouseMove:(e)=>this.mouseMove(e, state.scrolling, state.prevX, state.items),
        onDragStart:this.mouseDown,
        onDrag:(e)=>this.mouseMove(e, state.scrolling, state.prevX, state.items),
        onDragEnd:(e)=>this.mouseUp(e, state.items)
      },
        this._itemsToDom(state.items),
        h('span', { className: 'title', style: `opacity: ${leftOpacity};` }, leftTitle),
        h('span', { className: 'title', style: `opacity: ${rightOpacity};` }, rightTitle)
      )
    )
  }
}