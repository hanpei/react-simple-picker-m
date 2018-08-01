/* 
based on https://github.com/react-component/m-picker/blob/master/src/Picker.tsx
*/
// TODO: 设置动画function, duration, cancel animation
export class Scroller {
  constructor(el) {
    this.contentRef = el;
    this.wrapRef = el.parentNode;
    this.scrollY = -1;
    this.lastY = 0;
    this.startY = 0;
    this.isMoving = false;
    this.velocity = new Velocity();
    this.init();
  }

  init() {
    this.bindEvent(this.wrapRef);
    this.getEleHeight(this.wrapRef, this.contentRef);
  }

  update() {
    this.getEleHeight(this.wrapRef, this.contentRef);
  }

  getEleHeight(wrapRef, contentRef) {
    this.contentHeight = contentRef.getBoundingClientRect().height;
    this.wrapHeight = wrapRef.getBoundingClientRect().height;
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
  onStart = (e) => {
    e.preventDefault();
    const y = e.touches[0].screenY;

    this.isMoving = true;
    this.startY = y;
    this.lastY = this.scrollY;
  };
  onMove = (e) => {
    e.preventDefault();
    const y = e.touches[0].screenY;

    if (!this.isMoving) {
      return;
    }
    this.scrollY = this.lastY - y + this.startY;
    this.velocity.record(this.scrollY);
    this.setTransform(
      this.contentRef.style,
      `translate3d(0, ${-this.scrollY}px, 0)`
    );
  };
  onFinish = () => {
    this.isMoving = false;
    const targetY = this.scrollY;
    const maxHeight = this.contentHeight - this.wrapHeight;
    const { y, t } = this.velocity.getElasticDistance(targetY, maxHeight, 0.3);
    this.scrollTo(0, y, t);
  };
  onEnd = () => {
    this.setTransition(this.contentRef.style, '');
    this.onScrollComplete();
  }
  scrollTo(_x, y, time = 0.3) {
    if (this.scrollY !== y) {
      this.scrollY = y;
      if (time) {
        this.setTransition(
          this.contentRef.style,
          `cubic-bezier(0,0,0.2,1.15) ${time}s`
        );
      }
      this.setTransform(this.contentRef.style, `translate3d(0, ${-y}px, 0)`);
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
  getElasticDistance(targetY, maxHeight, delay = 0.3) {
    let t = delay;
    let y = targetY;
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
  constructor({ el, itemHeight, onScrollChange, selectedIndex }) {
    super(el);
    const defaultItemHeight =
      el.childNodes.length > 0 ? el.childNodes[0].offsetHeight : 20;
    this.itemHeight = itemHeight || defaultItemHeight;
    this.itemLength = this.contentRef.childNodes.length;
    this.onScrollChange = onScrollChange;
    this.selectedIndex = selectedIndex || 0;
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
    return this.scrollY;
  }

  getItemIndex(y, itemHeight, itemLength) {
    let index = Math.round(y / itemHeight);
    index = Math.min(index, itemLength - 1);
    return index;
  }

  // padding填充滚动区域
  setScrollContentHeight() {
    let num = Math.floor(this.wrapHeight / this.itemHeight);
    num = (num - 1) / 2;
    this.contentRef.style.paddingTop = `${this.itemHeight * num}px`;
    this.contentRef.style.paddingBottom = `${this.itemHeight * num}px`;
  }

  // overide scrollTo，根据itemHeight停止
  scrollTo(_x, y, time = 0.3) {
    let targetY = y;
    if (targetY % this.itemHeight !== 0) {
      const length = Math.round(targetY / this.itemHeight);
      targetY = length * this.itemHeight;
    }
    super.scrollTo(_x, targetY, time);
  }

  scrollToByIndex(index) {
    const y = this.itemHeight * index;
    this.scrollTo(0, y, 0);
  }

  // overide onScrollComplete
  onScrollComplete() {
    const scrollY = this.getScrollValue();
    const index = this.getItemIndex(scrollY, this.itemHeight, this.itemLength);
    typeof this.onScrollChange === 'function' && this.onScrollChange(index);
  }
}
