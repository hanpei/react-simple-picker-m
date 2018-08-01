import React from 'react';
import { shallow } from 'enzyme';
import Portal, { Slide } from '../Portal';

describe('Portal component', () => {
  it('render', () => {
    const component = shallow(
      <Portal component={() => <div>portal component</div>}>
        {() => <div>abc</div>}
      </Portal>
    );
    const fn = jest.spyOn(component.instance(), 'onToggle');
    expect(component).toMatchSnapshot();
    component.instance().onToggle();
    expect(fn).toBeCalled();
    component.unmount();
  });

  it('Slide component', () => {
    const slide = shallow(
      <Slide in={false}>
        <div>slide children</div>
      </Slide>
    );
    expect(slide).toMatchSnapshot();
  });
});
