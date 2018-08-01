export function eventTrigger(element, type, data) {
  const event = new window.Event(type);

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      event[key] = data[key];
    }
  }
  element.dispatchEvent(event);
}

function createClientXY(x, y) {
  return { screenX: x, screenY: y };
}

export function createStartTouchEventObject({ x = 0, y = 0 }) {
  return { touches: [createClientXY(x, y)] };
}

export function createMoveTouchEventObject({ x = 0, y = 0}) {
  // return { changedTouches: [createClientXY(x, y)] };
  return { touches: [createClientXY(x, y)] };
}

export function mockGetBoundingClientRect(el, props) {
  return (el.getBoundingClientRect = jest.fn(() => ({ ...props })));
}
