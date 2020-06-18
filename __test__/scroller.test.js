import { Scroller, Velocity, PickerScroller } from '../src/picker/scroller';
import {
  eventTrigger,
  createStartTouchEventObject,
  createMoveTouchEventObject,
  mockGetBoundingClientRect,
} from './utils';

function createEl() {
  const wrapper = document.createElement('div');
  const content = document.createElement('div');
  wrapper.setAttribute('id', 'wrapper');
  wrapper.appendChild(content);

  // mock getBoundingClientRect, wrapper height = 200, content height = 500
  // picker test: content has 10 div which height = 50, so content height = 50 * 10
  mockGetBoundingClientRect(wrapper, { width: 200, height: 200 });
  mockGetBoundingClientRect(content, { width: 200, height: 500 });
  document.body.appendChild(wrapper);
  return { wrapper, content };
}

function removeEl() {
  const wrapper = document.getElementById('wrapper');
  document.body.removeChild(wrapper);
}

describe('Scroller', () => {
  let wrapper;
  let content;
  beforeEach(() => {
    const el = createEl();
    wrapper = el.wrapper;
    content = el.content;
  });
  afterEach(() => {
    removeEl();
  });
  it('props', () => {
    const node = new Scroller(content);

    expect(node.contentRef).toEqual(content);
    expect(node.wrapRef).toEqual(wrapper);
    expect(node.scrollPos).toBe(-1);
    expect(node.lastPos).toBe(0);
    expect(node.startPos).toBe(0);
    expect(node.isMoving).toBeFalsy();
    expect(node.velocity).toBeInstanceOf(Velocity);
    expect(node.animatinmg).toBeFalsy();
    expect(node.direction).toEqual('y');
    expect(node.isDrag).toBeFalsy;
  });

  it('method: init', () => {
    const initSpy = jest.spyOn(Scroller.prototype, 'init');
    const bindSpy = jest.spyOn(Scroller.prototype, 'bindEvent');
    const scroller = new Scroller(content);

    expect(initSpy).toBeCalled();
    expect(bindSpy).toBeCalledWith(wrapper);
    expect(scroller.wrapRef).toBe(wrapper);
    expect(scroller.contentRef).toBe(content);
  });

  it('method: update, it should update the dom size', () => {
    const spy = jest.spyOn(Scroller.prototype, 'update');
    const spy2 = jest.spyOn(Scroller.prototype, 'getEleSize');
    const scroller = new Scroller(content);

    expect(spy).not.toBeCalled();
    expect(scroller.wrapHeight).toBe(200);
    expect(scroller.contentHeight).toBe(500);

    // update the dom size
    mockGetBoundingClientRect(wrapper, { width: 200, height: 100 });
    mockGetBoundingClientRect(content, { width: 200, height: 1500 });
    scroller.update(scroller.wrapRef, scroller.contentRef);
    expect(spy2).toBeCalledWith(scroller.wrapRef, scroller.contentRef);
    expect(scroller.wrapHeight).toBe(100);
    expect(scroller.contentHeight).toBe(1500);
  });

  it('method onStart', () => {
    const scroller = new Scroller(content);

    const evt = {
      preventDefault: jest.fn(),
      touches: [{ screenY: 123 }],
    };
    scroller.onStart(evt);
    expect(scroller.startPos).toBe(123);
  });
  it('method onStart: direction = x', () => {
    const scroller = new Scroller(content, 'x');

    const evt = {
      preventDefault: jest.fn(),
      touches: [{ screenX: 456 }],
    };
    scroller.onStart(evt);
    expect(scroller.startPos).toBe(456);
  });

  it('method onMove', () => {
    const scroller = new Scroller(content);

    const evt = {
      preventDefault: jest.fn(),
      touches: [{ screenPos: 123 }],
    };
    scroller.isMoving = true;
    scroller.onMove(evt);
  });

  it('method onMove: direction = x', () => {
    const scroller = new Scroller(content, 'x');

    const evt = {
      preventDefault: jest.fn(),
      touches: [{ screenPos: 456 }],
    };
    scroller.isMoving = true;
    scroller.onMove(evt);
  });

  it('touch events: touchstart', () => {
    const scroller = new Scroller(content);
    scroller.removeEvent(wrapper);
    const startSpy = jest.spyOn(scroller, 'onStart');

    scroller.bindEvent(scroller.wrapRef);

    eventTrigger(
      wrapper,
      'touchstart',
      createStartTouchEventObject({ x: 0, y: 50 })
    );

    const { startPos, lastPos, scrollPos, isMoving } = scroller;

    expect(startSpy).toBeCalled();
    expect(isMoving).toBeTruthy();
    expect(startPos).toBe(50);
    expect(lastPos).toBe(-1);
    expect(scrollPos).toBe(-1);
  });
  it('touch events: touchstart, when is scrolling', () => {
    const scroller = new Scroller(content);
    scroller.removeEvent(wrapper);
    const startSpy = jest.spyOn(scroller, 'onStart');
    const stopScrollingSpy = jest.spyOn(scroller, 'stopScrolling');

    scroller.bindEvent(scroller.wrapRef);
    scroller.animating = true;
    eventTrigger(
      wrapper,
      'touchstart',
      createStartTouchEventObject({ x: 0, y: 50 })
    );

    expect(stopScrollingSpy).toBeCalled();
  });

  it('touch events: touchmove, when isMoving is true', () => {
    const scroller = new Scroller(content);
    scroller.removeEvent(wrapper);
    const startSpy = jest.spyOn(scroller, 'onStart');
    const moveSpy = jest.spyOn(scroller, 'onMove');
    const setTransformSpy = jest.spyOn(scroller, 'setTransform');
    const recordSpy = jest.spyOn(scroller.velocity, 'record');
    scroller.bindEvent(scroller.wrapRef);

    eventTrigger(
      wrapper,
      'touchstart',
      createStartTouchEventObject({ x: 0, y: 0 })
    );
    eventTrigger(
      wrapper,
      'touchmove',
      createMoveTouchEventObject({ x: 0, y: 150 })
    );

    const { startPos, lastPos, scrollPos, isMoving } = scroller;
    expect(isMoving).toBeTruthy();
    expect(scrollPos).toBe(lastPos - 150 + startPos);
    expect(startSpy).toBeCalled();
    expect(moveSpy).toBeCalled();
    expect(recordSpy).toBeCalledWith(scrollPos);
    expect(setTransformSpy).toBeCalled();
    expect(scroller.contentRef.style.transform).toBe(
      'translate3d(0, 151px, 0)'
    );
  });

  it('touch events: touchmove, when isMoving is false', () => {
    const scroller = new Scroller(content);
    scroller.removeEvent(wrapper);
    const moveSpy = jest.spyOn(scroller, 'onMove');
    const setTransformSpy = jest.spyOn(scroller, 'setTransform');
    const recordSpy = jest.spyOn(scroller.velocity, 'record');
    scroller.bindEvent(scroller.wrapRef);
    eventTrigger(
      wrapper,
      'touchmove',
      createMoveTouchEventObject({ x: 0, y: 150 })
    );

    const { scrollPos, isMoving } = scroller;
    expect(isMoving).toBeFalsy();
    expect(scrollPos).toBe(-1);
    expect(moveSpy).toBeCalled();
    expect(recordSpy).not.toBeCalledWith(scrollPos);
    expect(setTransformSpy).not.toBeCalled();
  });

  it('touch events: touchend', () => {
    const scroller = new Scroller(content);
    scroller.removeEvent(wrapper);
    const scrollToSpy = jest.spyOn(Scroller.prototype, 'scrollTo');
    const endSpy = jest.spyOn(scroller, 'onFinish');
    const getElasticDistanceSpy = jest.spyOn(
      scroller.velocity,
      'getElasticDistance'
    );
    scroller.bindEvent(wrapper);

    eventTrigger(
      wrapper,
      'touchend',
      createMoveTouchEventObject({ x: 0, y: 120 })
    );

    expect(scroller.isMoving).toBeFalsy();
    expect(endSpy).toHaveBeenCalledTimes(1);
    expect(getElasticDistanceSpy).toBeCalled();
    expect(getElasticDistanceSpy).toHaveBeenCalledTimes(1);
    expect(scrollToSpy).toHaveBeenCalledTimes(1);
  });

  it('events: transitionEnd', () => {
    const scroller = new Scroller(content);
    scroller.removeEvent(wrapper);

    const onScrollCompleteSpy = jest.spyOn(scroller, 'onScrollComplete');
    scroller.bindEvent(wrapper);

    eventTrigger(wrapper, 'transitionend');
    expect(onScrollCompleteSpy).toHaveBeenCalledTimes(1);
  });

  it('scrollTo', () => {
    jest.useFakeTimers();
    const { content } = createEl();

    const scrollToSpy = jest.spyOn(Scroller.prototype, 'scrollTo');
    const scroller = new Scroller(content);
    const setTransformSpy = jest.spyOn(Scroller.prototype, 'setTransform');

    scroller.scrollTo(0, 100);
    expect(scrollToSpy).toBeCalledWith(0, 100);
    expect(setTransformSpy).toBeCalled();
    expect(scroller.scrollPos).toBe(100);
    expect(scroller.contentRef.style.transform).toBe(
      'translate3d(0, -100px, 0)'
    );
    expect(scroller.contentRef.style.transition).toBe(
      'cubic-bezier(0,0,0.2,1.15) 0.3s'
    );

    scroller.scrollTo(0, -200, 10);
    expect(scrollToSpy).toBeCalledWith(0, -200, 10);
    expect(setTransformSpy).toBeCalled();
    expect(scroller.scrollPos).toBe(-200);
    expect(scroller.contentRef.style.transform).toBe(
      'translate3d(0, 200px, 0)'
    );
    expect(scroller.contentRef.style.transition).toBe(
      'cubic-bezier(0,0,0.2,1.15) 10s'
    );
  });
});

describe('Velocity', () => {
  let wrapper;
  let content;
  beforeEach(() => {
    const el = createEl();
    wrapper = el.wrapper;
    content = el.content;
  });
  afterEach(() => {
    removeEl();
  });

  it('velocity', () => {
    // 两次时间戳的差用于计算速度
    Date.now = jest.fn().mockReturnValueOnce(0).mockReturnValueOnce(100);
    const recordSpy = jest.spyOn(Velocity.prototype, 'record');
    const getVelocitySpy = jest.spyOn(Velocity.prototype, 'getVelocity');
    const getElasticDistanceSpy = jest.spyOn(
      Velocity.prototype,
      'getElasticDistance'
    );
    const scroller = new Scroller(content);
    scroller.removeEvent(wrapper);
    scroller.bindEvent(scroller.wrapRef);

    eventTrigger(
      wrapper,
      'touchstart',
      createStartTouchEventObject({ x: 0, y: 0 })
    );
    eventTrigger(
      wrapper,
      'touchmove',
      createMoveTouchEventObject({ x: 0, y: 120 })
    );
    expect(recordSpy).toBeCalledWith(scroller.scrollPos);
    eventTrigger(
      wrapper,
      'touchmove',
      createMoveTouchEventObject({ x: 0, y: 220 })
    );
    expect(recordSpy).toBeCalledWith(scroller.scrollPos);

    // onFinish调用scrollTo后scrollPos会被重置, 记录一下用于计算
    const lastScrollPos = scroller.scrollPos;

    eventTrigger(
      wrapper,
      'touchend',
      createMoveTouchEventObject({ x: 0, y: 220 })
    );
    expect(getVelocitySpy).toBeCalledWith(lastScrollPos);
    const height = scroller.contentHeight - scroller.wrapHeight;

    expect(getElasticDistanceSpy).toBeCalledWith(lastScrollPos, height, 0.3);
  });

  it('getElasticDistance ', () => {
    const v = new Velocity();

    const { y, t } = v.getElasticDistance(1000, 200);
    expect(y).toBe(200);
    expect(t).toBe(0.3);

    const { y: y2, t: t2 } = v.getElasticDistance(100, 200, 3);
    expect(y2).toBe(100);
    expect(t2).toBe(3);

    // t < delay
    v.getVelocity = jest.fn().mockReturnValue(10);
    const { y: y3, t: t3 } = v.getElasticDistance(180, 200, 5);
    expect(y3).toBe(200);
    expect(t3).toBe(5);

    // t > delay
    v.getVelocity = jest.fn().mockReturnValue(10);
    const { y: y4, t: t4 } = v.getElasticDistance(180, 200, 0.5);
    expect(y4).toBe(200);
    expect(t4).toBe(1);
  });
});

describe('PickerScroller', () => {
  let wrapper;
  let content;

  beforeEach(() => {
    const el = createEl();
    wrapper = el.wrapper;
    content = el.content;
    let html = '';
    for (let i = 0; i < 10; i++) {
      html += `<div>${(i + 1).toString()}</div>`;
    }
    content.innerHTML = html;
  });
  afterEach(() => {
    removeEl();
  });

  it('props', () => {
    const mockFn = jest.fn();

    const props = {
      el: content,
      itemHeight: 50,
      onScrollChange: mockFn,
      selectedIndex: 3,
    };
    const node = new PickerScroller(props);
    expect(node).toBeInstanceOf(Scroller);
    expect(node.itemHeight).toBe(50);
    expect(node.itemLength).toBe(10);
    expect(node.selectedIndex).toBe(3);
    expect(node.onScrollChange).toBe(mockFn);

    const props2 = {
      el: content,
      onScrollChange: mockFn,
    };

    const node2 = new PickerScroller(props2);
    expect(node2).toBeInstanceOf(Scroller);
    expect(node2.itemHeight).toBe(0);
    expect(node2.itemLength).toBe(10);
    expect(node2.selectedIndex).toBe(0);
    expect(node2.onScrollChange).toBe(mockFn);

    content.innerHTML = '';
    const props3 = {
      el: content,
      onScrollChange: mockFn,
    };

    const node3 = new PickerScroller(props3);
    expect(node3).toBeInstanceOf(Scroller);
    expect(node3.itemHeight).toBe(20);
  });

  it('init', () => {
    const mockFn = jest.fn();

    const props = {
      el: content,
      itemHeight: 50,
      onScrollChange: mockFn,
      selectedIndex: 3,
    };
    const superInitSpy = jest.spyOn(Scroller.prototype, 'init');
    const initSpy = jest.spyOn(PickerScroller.prototype, 'init');
    const scrollToByIndexSpy = jest.spyOn(
      PickerScroller.prototype,
      'scrollToByIndex'
    );
    const setScrollContentHeightSpy = jest.spyOn(
      PickerScroller.prototype,
      'setScrollContentHeight'
    );

    new PickerScroller(props);

    expect(initSpy).toBeCalled();
    expect(superInitSpy).toBeCalled();
    expect(scrollToByIndexSpy).toBeCalledWith(3);
    expect(setScrollContentHeightSpy).toBeCalled();
  });

  it('update', () => {
    const mockFn = jest.fn();

    const props = {
      el: content,
      itemHeight: 50,
      onScrollChange: mockFn,
      selectedIndex: 3,
    };
    const updateSpy = jest.spyOn(PickerScroller.prototype, 'update');
    const superUpdateSpy = jest.spyOn(Scroller.prototype, 'update');
    const spy1 = jest.spyOn(PickerScroller.prototype, 'scrollToByIndex');
    const spy2 = jest.spyOn(PickerScroller.prototype, 'onScrollComplete');

    const picker = new PickerScroller(props);
    picker.update(5);
    expect(updateSpy).toBeCalledWith(5);
    expect(superUpdateSpy).toBeCalled();
    expect(spy1).toBeCalledWith(5);
    expect(spy2).toBeCalled();
  });

  it('setScrollContentHeight ', () => {
    const mockFn = jest.fn();
    const props = {
      el: content,
      itemHeight: 50,
      onScrollChange: mockFn,
      selectedIndex: 3,
    };
    const node = new PickerScroller(props);

    const result =
      ((Math.floor(node.wrapHeight / node.itemHeight) - 1) / 2) *
      node.itemHeight;
    expect(node.contentRef.style.paddingTop).toBe(`${result}px`);
    expect(node.contentRef.style.paddingBottom).toBe(`${result}px`);
  });

  it('scrollTo step by step', () => {
    const mockFn = jest.fn();
    const props = {
      el: content,
      itemHeight: 50,
      onScrollChange: mockFn,
      selectedIndex: 3,
    };
    const scrollToSpy = jest.spyOn(Scroller.prototype, 'scrollTo');
    const node = new PickerScroller(props);

    node.scrollTo(0, 345);
    let targetY = 345;
    if (targetY % node.itemHeight !== 0) {
      const length = Math.round(targetY / node.itemHeight);
      targetY = length * node.itemHeight;
    }
    expect(scrollToSpy).toBeCalledWith(0, targetY, 0.3);

    node.scrollTo(0, 300, 3);
    let targetY2 = 300;
    if (targetY2 % node.itemHeight !== 0) {
      const length = Math.round(targetY2 / node.itemHeight);
      targetY2 = length * node.itemHeight;
    }
    expect(scrollToSpy).toBeCalledWith(0, targetY2, 3);
  });

  it('touch events: touchstart', () => {
    const mockFn = jest.fn();
    const props = {
      el: content,
      itemHeight: 50,
      onScrollChange: mockFn,
      selectedIndex: 3,
    };
    const picker = new PickerScroller(props);
    picker.removeEvent(wrapper);
    const startSpy = jest.spyOn(picker, 'onStart');

    picker.bindEvent(picker.wrapRef);

    eventTrigger(
      wrapper,
      'touchstart',
      createStartTouchEventObject({ x: 0, y: 50 })
    );

    expect(startSpy).toBeCalled();
  });

  it('touch events: touchmove', () => {
    const mockFn = jest.fn();
    const props = {
      el: content,
      itemHeight: 50,
      onScrollChange: mockFn,
      selectedIndex: 3,
    };
    const picker = new PickerScroller(props);
    picker.removeEvent(wrapper);
    const startSpy = jest.spyOn(picker, 'onStart');
    const moveSpy = jest.spyOn(picker, 'onMove');
    picker.bindEvent(picker.wrapRef);

    eventTrigger(
      wrapper,
      'touchstart',
      createStartTouchEventObject({ x: 0, y: 0 })
    );
    eventTrigger(
      wrapper,
      'touchmove',
      createMoveTouchEventObject({ x: 0, y: 150 })
    );

    const { startPos, lastPos, scrollPos, isMoving } = picker;
    expect(isMoving).toBeTruthy();
    expect(startPos).toBe(0);
    expect(lastPos).toBe(50 * 3);
    expect(scrollPos).toBe(lastPos - 150 + startPos);
    expect(startSpy).toBeCalled();
    expect(moveSpy).toBeCalled();
  });

  it('touch events: touchend', () => {
    const mockFn = jest.fn();
    const props = {
      el: content,
      itemHeight: 50,
      onScrollChange: mockFn,
      selectedIndex: 4,
    };
    const picker = new PickerScroller(props);
    picker.removeEvent(wrapper);
    const endSpy = jest.spyOn(picker, 'onFinish');
    const onScrollCompleteSpy = jest.spyOn(picker, 'onScrollComplete');
    picker.bindEvent(wrapper);

    eventTrigger(
      wrapper,
      'touchend',
      createMoveTouchEventObject({ x: 0, y: 120 })
    );
    expect(endSpy).toBeCalled();
    expect(onScrollCompleteSpy).toBeCalled();
  });
});
