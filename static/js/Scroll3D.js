"use strict";

/**
 * This object is buggy and will be discontinued. It will be replaced by FadeItemBoard.
 */

const _LEFT = true;
const _RIGHT = false;
const _ANIMATE_STEPS = 20;
const _ANIMATE_PAUSE = 10;
// Between 0 and 1 (percent distance halfway around circle)
// Smaller values make it more likely to be considered scrolling
const SCROLL_THRESHOLD = 0.01;
// Between 0 and 1 (percent distance from one item to next)
// Smaller values make it bounce back more.
const BOUNCE_BACK_THRESHOLD = 0.7;

const isZero = (num) => {
  const epsilon = 0.0001;
  return Math.abs(num) < epsilon;
}

class Item {
  constructor(title, img, progress) {
    this.title = title;
    this.img = img;
    this.progress = progress;
  }
}

class Scroll3D extends Component {
  constructor(props) {
    super(props);
    this._itemsToDom = this._itemsToDom.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this._getDisplayText = this._getDisplayText.bind(this);
    this._rotateOne = this._rotateOne.bind(this);
    this.rotationLoop = this.rotationLoop.bind(this);
    this.restartLoop = this.restartLoop.bind(this);
    const total = props.items.length;
    this.step = 2 / total;
    let progress = 0;
    this.state.items = [];
    // Need to store positions so we can snap items to the grid when done moving.
    this.positions = [];
    for (let item of props.items) {
      this.positions.push(progress);
      this.state.items.push(new Item(
        item.title,
        item.img,
        progress
      ));
      progress += this.step;
      if (progress > 1) {
        progress = -1 + (progress - 1);
      }
    }
    this.imgWidthPercent = 70;
    this.setState({ scrolling: false });
    this.direction = _RIGHT;
    this.directions = [];
    this.rotationLoop();
  }
  /**
   * Assigns the position of each item to be its expected final resting point for this rotation.
   * Essentially snaps all items to a proper position.
   * This is also the most logical place to reset the loop, in case we clicked on something recently.
   * @param {*} items 
   */
  _assignNearestPosition(items) {
    for (let i in items) {
      let mini = 1;
      let positionsIndex = 0;
      for (let j in this.positions) {
        if (Math.abs(this.positions[j] - items[i].progress) < mini) {
          mini = Math.abs(this.positions[j] - items[i].progress);
          positionsIndex = j;
        }
      }
      items[i].progress = this.positions[positionsIndex];
    }
    this.restartLoop();
    return items;
  }
  restartLoop() {
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
    }
    this.rotationLoop();
  }
  rotationLoop() {
    this.loopTimer = setTimeout(() => {
      if (!this.state.scrolling) {
        this._rotateOne();
      }
      this.rotationLoop();
    }, 3000);
  }
  _rotateOne(clockwise) {
    if (typeof clockwise != 'boolean') {
      clockwise = true;
    }

    let nextItem = null;
    for (let item of this.state.items) {
      if (isZero(item.progress)) {
        continue;
      }
      if (!nextItem
        || (clockwise && item.progress > 0 && item.progress < nextItem.progress)
        || (!clockwise && item.progress < 0 && item.progress < nextItem.progress)) {
        nextItem = item;
      }
    }
    this._GoToOne(nextItem);
  }
  _addRecentDirection(dir) {
    if (this.directions.length == 3) {
      this.directions.splice(0, 1);
    }
    this.directions.push(dir == _LEFT ? 1 : 0);
    let sum = 0;
    this.directions.forEach(val => sum += val)
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
  _itemsToDom(items, scrolling) {
    // Sort so that furthest items draw first (for z-axis)
    const COMPARE = (a, b) => {
      return Math.abs(a.progress) < Math.abs(b.progress);
    }
    items.sort(COMPARE)
    return items.map(item => {
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
          onMouseUp: scrolling ? null : (e) => { e.preventDefault(); e.stopPropagation(); this._GoToOne(item); },
          onTouchEnd: scrolling ? null : (e) => { e.preventDefault(); e.stopPropagation(); this._GoToOne(item); },
          style: `
            max-height: ${this.imgWidthPercent}%;
            max-width: ${this.imgWidthPercent}%;
          `
        })
      )
    });
  }
  _updateProgress(diff, items) {
    items = items.map(item => {
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
  /**
   * 
   * @param {*} distance Final amount (between -1 and 1, which would be 360 degrees by direction) that you want to go in the circle.
   * @param {*} items 
   */
  _move(distance) {
    const amount = distance / _ANIMATE_STEPS;
    let items = this.state.items;
    const moveABit = (actionCounter) => {
      items = actionCounter > 1 ? items.map(item => {
        item.progress = item.progress + amount;
        if (item.progress > 1) {
          item.progress = item.progress - 2;
        }
        if (item.progress < -1) {
          item.progress = item.progress + 2;
        }
        return item;
      }) : this._assignNearestPosition(items);
      this.setState({ items: items, actionCounter: actionCounter - 1 })
    }
    this.setState({ action: (actionCounter) => window.setTimeout(() => moveABit(actionCounter), _ANIMATE_PAUSE), actionCounter: _ANIMATE_STEPS })
  }
  /**
   * @param {*} target item object (held by this.state.items)
   */
  _GoToOne(target) {
    this._move(-1 * target.progress)
    this.setState({ prevX: null, scrolling: false });
  }
  mouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    const t = e.changedTouches && e.changedTouches[0] || e.touches && e.touches[0] || e;
    const newX = e.clientX ? e.clientX : t.pageX ? t.pageX : null;
    this.setState({ scrolling: false, prevX: newX });
  }
  mouseUp(e, items, scrolling) {
    e.preventDefault();
    e.stopPropagation();
    if (scrolling) {
      this._evenOut(items);
    }
    this.setState({ prevX: null, scrolling: false });
  }
  mouseMove(e, scrolling, prevX, items) {
    if (!prevX) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const t = e.changedTouches && e.changedTouches[0] || e.touches && e.touches[0] || e;
    const newX = e.clientX ? e.clientX : t.pageX ? t.pageX : null;
    const diff = newX - prevX;
    if (diff < 0) this._addRecentDirection(_LEFT);
    if (diff > 0) this._addRecentDirection(_RIGHT);
    this._updateProgress(diff, items);
    if (!scrolling && !items.some(item => Math.abs(item.progress) < SCROLL_THRESHOLD)) { this.setState({ scrolling: true }); }
    this.setState({ prevX: newX });
  }
  /**
   * Returns bottom text div parameters {leftOpacity, rightOpacity, leftTitle, rightTitle}.
   * @param {*} items 
   */
  _getDisplayText(items) {
    let itemRight = this._getMinAbsoluteProgress(items.filter(x => x.progress <= 0));
    let itemLeft = this._getMinAbsoluteProgress(items.filter(x => x.progress >= 0));
    let leftOpacity = 0;
    let rightOpacity = 0;
    if (Math.abs(itemRight.progress) < Math.abs(itemLeft.progress)) {
      rightOpacity = 1 - (Math.abs(itemRight.progress) / this.step);
      leftOpacity = 1 - (Math.abs(itemLeft.progress) / this.step);
    } else {
      leftOpacity = 1 - (Math.abs(itemLeft.progress) / this.step);
      rightOpacity = 1 - (Math.abs(itemRight.progress) / this.step);
    }
    return {
      leftOpacity: leftOpacity,
      rightOpacity: rightOpacity,
      leftTitle: itemLeft.title,
      rightTitle: itemRight.title
    }
  }
  _evenOut(items) {
    let closest = this._getMinAbsoluteProgress(items);
    let closestLeft = this._getMinAbsoluteProgress(items.filter(item => item.progress <= 0));
    let closestRight = this._getMinAbsoluteProgress(items.filter(item => item.progress >= 0));
    const diff = Math.abs(Math.abs(closestLeft.progress) - Math.abs(closestRight.progress));
    if (diff < (this.step * BOUNCE_BACK_THRESHOLD)) {
      if (this.direction == _LEFT) {
        closest = closestRight;
      } else {
        closest = closestLeft;
      }
    }
    this._GoToOne(closest);
  }
  render(props, state) {
    const displayText = this._getDisplayText(state.items);
    const leftOpacity = displayText.leftOpacity;
    const rightOpacity = displayText.rightOpacity;
    const leftTitle = displayText.leftTitle;
    const rightTitle = displayText.rightTitle;
    if (state.actionCounter > 0) {
      state.action(state.actionCounter);
    }
    return (
      h('div', {
        className: "Scroll3D",
        onMouseDown: this.mouseDown,
        onMouseUp: state.actionCounter ? null : (e) => this.mouseUp(e, state.items, state.scrolling),
        onMouseMove: state.actionCounter ? null : (e) => this.mouseMove(e, state.scrolling, state.prevX, state.items),
        onMouseLeave: state.actionCounter ? null : (e) => this.mouseUp(e, state.items, state.scrolling),
        onTouchStart: state.actionCounter ? null : this.mouseDown,
        onTouchMove: state.actionCounter ? null : (e) => this.mouseMove(e, state.scrolling, state.prevX, state.items),
        onTouchEnd: state.actionCounter ? null : (e) => this.mouseUp(e, state.items, state.scrolling),
        onTouchCancel: state.actionCounter ? null : (e) => this.mouseUp(e, state.items, state.scrolling)
      },
        this._itemsToDom(state.items, state.scrolling),
        h('span', { className: 'title', style: `opacity: ${leftOpacity};` }, leftTitle),
        h('span', { className: 'title', style: `opacity: ${rightOpacity};` }, rightTitle)
      )
    )
  }
}