import React from 'react';
import { mount } from 'enzyme';

import DatePicker from '../DatePicker';

// const mockFn = jest.fn().mockImplementation((value) => value);

describe('Picker component', () => {
  it('mount', () => {
    const props = {
      onToggle: jest.fn(),
      onConfirm: jest.fn(),
      onValueChanged: jest.fn(),
      defaultDate: '1992-02-02',
      from: '1990-01-02',
      to: '2018-12-31'
    };
    const component = mount(<DatePicker {...props} />);
    expect(component).toMatchSnapshot();
    component.unmount();
  });

  it('props with empty string', () => {
    const props = {
      onToggle: jest.fn(),
      onConfirm: jest.fn(),
      onValueChanged: jest.fn(),
      defaultDate: '',
      from: '',
      to: ''
    };
    const component = mount(<DatePicker {...props} />);
    expect(component).toMatchSnapshot();
    component.unmount();
  });

  it('change year, month, day', () => {
    const props = {
      onToggle: jest.fn(),
      onConfirm: jest.fn(),
      onValueChanged: jest.fn(),
      defaultDate: '1992-02-02',
      from: '1990-01-12',
      to: '2018-12-15'
    };

    const fn = jest.spyOn(DatePicker.prototype, 'changeSelectedValue');
    const component = mount(<DatePicker {...props} />);
    component.instance().handleYearChange({ value: '2000' });
    expect(fn).toBeCalled();
    expect(component).toMatchSnapshot();
    component.instance().handleMonthChange({ value: '03' });
    expect(fn).toBeCalled();
    expect(component).toMatchSnapshot();
    component.instance().handleDayChange({ value: '02' });
    expect(fn).toBeCalled();
    expect(component).toMatchSnapshot();
  });

  it('date range', () => {
    const props = {
      onToggle: jest.fn(),
      onConfirm: jest.fn(),
      onValueChanged: jest.fn(),
      defaultDate: '1992-02-20',
      from: '1990-01-12',
      to: '2018-12-15'
    };

    const fn = jest.spyOn(DatePicker.prototype, 'changeSelectedValue');
    const component = mount(<DatePicker {...props} />);

    // from
    component.instance().handleYearChange({ value: '1990' });
    component.instance().handleMonthChange({ value: '01' });
    expect(fn).toBeCalled();
    expect(component).toMatchSnapshot();

    // to
    component.instance().handleYearChange({ value: '2018' });
    component.instance().handleMonthChange({ value: '12' });

    expect(fn).toBeCalled();
    expect(component).toMatchSnapshot();
  });

  it('defaultDate and date range', () => {
    const props = {
      onToggle: jest.fn(),
      onConfirm: jest.fn(),
      onValueChanged: jest.fn(),
      defaultDate: '1900-02-20',
      from: '1990-01-12',
      to: '2018-12-15'
    };
    const props2 = {
      onToggle: jest.fn(),
      onConfirm: jest.fn(),
      onValueChanged: jest.fn(),
      defaultDate: '2900-02-20',
      from: '1990-01-12',
      to: '2018-12-15'
    };

    const component1 = mount(<DatePicker {...props} />);
    expect(component1).toMatchSnapshot();
    component1.unmount();

    const component2 = mount(<DatePicker {...props2} />);
    expect(component2).toMatchSnapshot();
    component2.unmount();
  });

  it('button event', () => {
    const props = {
      onToggle: jest.fn(),
      onConfirm: jest.fn(),
      onValueChanged: jest.fn(),
      defaultDate: '1992-02-20',
      from: '1990-01-12',
      to: '2018-12-15'
    };

    const component = mount(<DatePicker {...props} />);

    component.find('button').at(1).simulate('click')
    expect(component.props().onToggle).toBeCalled()
    expect(component.props().onConfirm).toBeCalled()
    expect(component).toMatchSnapshot();

    component.find('button').at(0).simulate('click')
    expect(component.props().onToggle).toBeCalled()
    expect(component).toMatchSnapshot();
  });
});
