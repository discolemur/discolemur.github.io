"use strict";

/**
 * This object displays an icon with its title, then fades to the next icon with title. It loops.
 */

class FadeItemBoard extends Component {
  constructor(props) {
    super(props);
    this.fadeLoop = this.fadeLoop.bind(this);
    this._endFade = this._endFade.bind(this);
    this._fadeNext = this._fadeNext.bind(this);
    this.totalItems = props.items.length;
    this.setState({
      opacities: {
        prev: 0,
        current: 1
      },
      currentItemIndex: 0
    });
    this.fadeLoop();
  }
  fadeLoop() {
    this._fadeNext();
    // Fade to the next item
    this.loopTimer = setTimeout(() => {
      this.fadeLoop();
    }, FadeItemBoard.FADE_LOOP_TIMEOUT);
  }
  _endFade() {
    this.setState({
      opacities: {
        current: 1,
        prev: 0
      }
    });
  }
  _fadeNext(clockwise) {
    let ms = 0;
    this.setState({
      currentItemIndex : (this.state.currentItemIndex + 1) % this.totalItems,
      opacities: {
        current: 0,
        prev: 1
      }
    })
    do {
      setTimeout(()=>{
        this.setState({
          opacities: {
            prev: this.state.opacities.prev - FadeItemBoard.FADE_STEP,
            current: this.state.opacities.current + FadeItemBoard.FADE_STEP
          }
        })
      }, ms);
      ms++;
    } while (ms <= FadeItemBoard.FADE_SPEED);
    setTimeout(()=>{
      this._endFade();
    }, ms);
  }
  render(props, state) {
    let currentItem = props.items[state.currentItemIndex];
    let prevItem = props.items[state.currentItemIndex == 0 ? props.items.length - 1 : state.currentItemIndex - 1];
    return (
      h('div', {
          className: "FadeItemBoard",
        },
        h('div', {style: "max-width: 100px; margin: auto;"},
          h('img', {
            src: currentItem.img,
            style: `opacity: ${state.opacities.current}; position: relative;`
          }),
          h('img', {
            src: prevItem.img,
            style: `opacity: ${state.opacities.prev}; position: absolute;`
          }),
          h('span', { className: 'title', style: `opacity: ${state.opacities.current};` }, currentItem.title),
          h('span', { className: 'title', style: `opacity: ${state.opacities.prev};` }, prevItem.title)
        )
      )
    );
  }
}

FadeItemBoard.FADE_SPEED = 1000;
FadeItemBoard.FADE_LOOP_TIMEOUT = 3000;
FadeItemBoard.FADE_STEP = 1 / FadeItemBoard.FADE_SPEED;