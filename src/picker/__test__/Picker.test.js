import React from 'react';
import { mount } from 'enzyme';

import Picker from '../Picker';

const pickerOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const pickerOptions2 = [ '3', '4', '5', '6'];
const pickerOptions3 = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11'
];
const mockFn = jest.fn().mockImplementation((value) => value);

describe('Picker component', () => {
  it('should render', () => {
    const component = mount(
      <Picker
        options={pickerOptions}
        onScrollChange={mockFn}
        selectedValue={'3'}
      />
    );
    expect(component).toMatchSnapshot();
    component.unmount();
  });
  // manually trigger the callback
  it('should handle onScrollChange callback', () => {
    const component = mount(
      <Picker
        options={pickerOptions}
        onScrollChange={mockFn}
        selectedValue={'3'}
      />
    );
    component.props().onScrollChange('4');
    expect(mockFn).toBeCalledWith('4');
    expect(component).toMatchSnapshot();
    component.unmount;
  });

  it('props', () => {
    const component = mount(
      <Picker options={pickerOptions} onScrollChange={mockFn} />
    );
    expect(component).toMatchSnapshot();
  });
  it('life circl', () => {
    const spyMount = jest.spyOn(Picker.prototype, 'componentDidMount');
    const spyUpdate = jest.spyOn(Picker.prototype, 'componentDidUpdate');
    const spyUnmount = jest.spyOn(Picker.prototype, 'componentWillUnmount');
    const spyFn = jest.spyOn(Picker.prototype, 'getIndexByValue');
    const spyFn2 = jest.spyOn(Picker.prototype, 'updateIndexByValue');

    const picker = mount(
      <Picker
        options={pickerOptions}
        onScrollChange={mockFn}
        selectedValue={'9'}
      />
    );

    expect(spyMount).toBeCalled();
    expect(spyFn).toBeCalled();

    picker.setProps({ options: pickerOptions2 });
    expect(picker).toMatchSnapshot();
    expect(spyUpdate).toBeCalled();
    expect(spyFn2).toBeCalled();


    picker.unmount();
    expect(spyUnmount).toBeCalled();
  });
  it('update the selectedIndex, when options change', () => {
    const picker = mount(
      <Picker
        options={pickerOptions}
        onScrollChange={mockFn}
        selectedValue={'abc'}
      />
    );

    picker.setProps({ options: pickerOptions2 });
    expect(picker).toMatchSnapshot();
    picker.setProps({ options: pickerOptions3 })
    expect(picker).toMatchSnapshot();
    picker.unmount()

  });
});
