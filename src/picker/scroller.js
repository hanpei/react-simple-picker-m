/* 
based on https://github.com/react-component/m-picker/blob/master/src/Picker.tsx
*/
export class Scroller {
  constructor(el, direction) {
    this.contentRef = el;
    this.wrapRef = el.parentNode;
    this.scrollPos = -1;
    this.lastPos = 0;
    this.startPos = 0;
    this.isMoving = false;
    this.velocity = new Velocity();
    this.animating = false; // use to stop elastic scrolling when touchstart
    this.direction = direction || 'y';
    this.init();
  }

  init() {
    this.bindEvent(this.wrapRef);
    this.getEleSize(this.wrapRef, this.contentRef);
  }

  update() {
    this.getEleSize(this.wrapRef, this.contentRef);
  }

  getEleSize(wrapRef, contentRef) {
    console.log(this.direction);
    if (this.direction === 'x') {
      this.contentHeight = contentRef.getBoundingClientRect().width;
      this.wrapHeight = wrapRef.getBoundingClientRect().width;
    } else {
      this.contentHeight = contentRef.getBoundingClientRect().height;
      this.wrapHeight = wrapRef.getBoundingClientRect().height;
    }
  }

  bindEvent(el) {
    el.addEventListener('touchstart', this.onStart);
    el.addEventListener('touchmove', this.onMove);
    el.addEventListener('touchend', this.onFinish);
    el.addEventListener('touchcancel', this.onFinish);
    el.addEventListener('transitionend', this.onEnd);
  }
  removeEvent(el) {
    el.removeEventListener('touchstart', this.onStart);
    el.removeEventListener('touchmove', this.onMove);
    el.removeEventListener('touchend', this.onFinish);
    el.removeEventListener('touchcancel', this.onFinish);
    el.removeEventListener('transitionend', this.onEnd);
  }
  onStart = e => {
    e.preventDefault();
    let pos = 0;
    if (this.direction === 'x') {
      pos = e.touches[0].screenX;
    } else {
      pos = e.touches[0].screenY;
    }
    if (this.animating) {
      this.stopScrolling();
    }

    this.isMoving = true;
    this.startPos = pos;
    this.lastPos = this.scrollPos;
  };
  onMove = e => {
    e.preventDefault();
    let pos = 0;
    if (this.direction === 'x') {
      pos = e.touches[0].screenX;
    } else {
      pos = e.touches[0].screenY;
    }

    if (!this.isMoving) {
      return;
    }
    this.scrollPos = this.lastPos - pos + this.startPos;
    this.velocity.record(this.scrollPos);
    if (this.direction === 'x') {
      this.setTransform(
        this.contentRef.style,
        `translate3d(${-this.scrollPos}px, 0, 0)`
      );
    } else {
      this.setTransform(
        this.contentRef.style,
        `translate3d(0, ${-this.scrollPos}px, 0)`
      );
    }
  };
  onFinish = () => {
    this.isMoving = false;
    const targetPos = this.scrollPos;
    const maxHeight = this.contentHeight - this.wrapHeight;
    const { y, t } = this.velocity.getElasticDistance(
      targetPos,
      maxHeight,
      0.3
    );
    if (this.direction === 'x') {
      this.scrollTo(y, 0, t);
    } else {
      this.scrollTo(0, y, t);
    }
  };
  onEnd = () => {
    this.setTransition(this.contentRef.style, '');
    this.onScrollComplete();
  };
  stopScrolling() {
    this.setTransition(this.contentRef.style, '');
    this.animating = false;
  }
  scrollTo(x, y, time = 0.3) {
    if (this.direction === 'x') {
      if (this.scrollPos !== x) {
        this.scrollPos = x;
        if (time) {
          this.setTransition(
            this.contentRef.style,
            `cubic-bezier(0,0,0.2,1.15) ${time}s`
          );
          this.animating = true;
        }
        this.setTransform(this.contentRef.style, `translate3d(${-x}px, 0, 0)`);
      }
    } else {
      if (this.scrollPos !== y) {
        this.scrollPos = y;
        if (time) {
          this.setTransition(
            this.contentRef.style,
            `cubic-bezier(0,0,0.2,1.15) ${time}s`
          );
          this.animating = true;
        }
        this.setTransform(this.contentRef.style, `translate3d(0, ${-y}px, 0)`);
      }
    }
  }
  setTransform(nodeStyle, value) {
    nodeStyle.transform = value;
    nodeStyle.webkitTransform = value;
  }
  setTransition(nodeStyle, value) {
    nodeStyle.transition = value;
    nodeStyle.webkitTransition = value;
  }
  onScrollComplete() {}
}

export class Velocity {
  constructor(minInterval = 30, maxInterval = 100) {
    this.minInterval = minInterval;
    this.maxInterval = maxInterval;
    this._time = 0;
    this._y = 0;
    this._velocity = 0;
  }
  record(y) {
    const now = Date.now();
    this._velocity = (y - this._y) / (now - this._time);

    if (now - this._time >= this.minInterval) {
      this._velocity =
        now - this._time <= this.maxInterval ? this._velocity : 0;
      this._y = y;
      this._time = now;
    }
  }
  getVelocity(y) {
    if (y !== this._y) {
      this.record(y);
    }
    return this._velocity;
  }
  getElasticDistance(targetPos, maxHeight, delay = 0.3) {
    let t = delay;
    let y = targetPos;
    const v = this.getVelocity(y);
    if (v) {
      y = v * 160 + y;
      t = Math.abs(v) * 0.1;
      t = t < delay ? delay : t;
    }
    if (y < 0) {
      y = 0;
    } else if (y > maxHeight) {
      y = maxHeight;
    }
    return { y, t };
  }
}

export class PickerScroller extends Scroller {
  constructor({ el, itemHeight, onScrollChange, selectedIndex, direction }) {
    const defaultItemHeight =
    super(el, direction);
      el.childNodes.length > 0 ? el.childNodes[0].offsetHeight : 20;
    this.itemHeight = itemHeight || defaultItemHeight;
    this.itemLength = this.contentRef.childNodes.length;
    this.onScrollChange = onScrollChange;
    this.selectedIndex = selectedIndex || 0;
    this.direction = direction || 'y';
    this.init();
  }

  init() {
    // console.log('init');
    // 设置高度后，需要调用super.init重新初始化计算相关高度
    this.setScrollContentHeight();
    this.scrollToByIndex(this.selectedIndex);
    super.init();
  }

  update(index) {
    // options改变导致高度改变
    super.update();
    this.scrollToByIndex(index);
    this.onScrollComplete();
  }

  getScrollValue() {
    return this.scrollPos;
  }

  getItemIndex(y, itemHeight, itemLength) {
    let index = Math.round(y / itemHeight);
    index = Math.min(index, itemLength - 1);
    return index;
  }

  // padding填充滚动区域
  setScrollContentHeight() {
    let num = Math.floor(this.wrapHeight / this.itemHeight);
    console.log(this.wrapHeight);
    console.log(this.itemHeight);
    num = (num - 1) / 2;
    if (this.direction === 'x') {
      num = Math.round(num)
      this.contentRef.style.paddingLeft = `${this.itemHeight * (num)}px`;
      this.contentRef.style.paddingRight = `${this.itemHeight * (num)}px`;
    } else {
      this.contentRef.style.paddingTop = `${this.itemHeight * num}px`;
      this.contentRef.style.paddingBottom = `${this.itemHeight * num}px`;
    }
  }

  // overide scrollTo，根据itemHeight停止
  scrollTo(x, y, time = 0.3) {
    if (this.direction === 'x') {
      let targetPos = x;
      if (targetPos % this.itemHeight !== 0) {
        const length = Math.round(targetPos / this.itemHeight);
        targetPos = length * this.itemHeight;
      }
      super.scrollTo(targetPos, y, time);
    } else {
      let targetPos = y;
      if (targetPos % this.itemHeight !== 0) {
        const length = Math.round(targetPos / this.itemHeight);
        targetPos = length * this.itemHeight;
      }
      super.scrollTo(x, targetPos, time);
    }
  }

  scrollToByIndex(index) {
    if (this.direction === 'x') {
      const x = this.itemHeight * index;
      this.scrollTo(x, 0, 0);
    } else {
      const y = this.itemHeight * index;
      this.scrollTo(0, y, 0);
    }
  }

  // overide onScrollComplete
  onScrollComplete() {
    const scrollPos = this.getScrollValue();
    const index = this.getItemIndex(
      scrollPos,
      this.itemHeight,
      this.itemLength
    );
    typeof this.onScrollChange === 'function' && this.onScrollChange(index);
  }
}
