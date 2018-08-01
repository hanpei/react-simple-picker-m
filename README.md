# react-simple-picker-m
react mobile picker, datepicker
---
[![Build Status](https://travis-ci.org/hanpei/react-simple-picker-m.svg?branch=master)](https://travis-ci.org/hanpei/react-simple-picker-m)
[![codecov](https://codecov.io/gh/hanpei/react-simple-picker-m/branch/master/graph/badge.svg)](https://codecov.io/gh/hanpei/react-simple-picker-m)


---
## scroller.js

`class Scroller`
* transition + transform 模拟滚动
* 模拟滚动惯性

`class PickerScroller`
* 继承`Scroller`
* 滚动分级停止
* 滚动到指定index

## Picker.js
* 单个滚动选择器

## DatePicker.js
* 3个`Picker`组成
* 年月日数据处理

## Portal.js
* 提供`createPortal`
* 提供`Slide`动画

## examples

```
import React, { Component } from 'react';
import { render} from 'react-dom';
import { DatePicker, Portal } from '../../src';

class DatePickerContainer extends Component {
  state = {
    selectedValue: '15',
    selectedDate: ''
  };
  handleScrollChange = (result) => {
    this.setState({ selectedValue: result.value });
    console.log(this.state);
  };

  handleSelect = (value) => {
    console.log(value);
    this.setState({
      selectedDate: value
    });
  };

  render() {
    return (
      <div>
        {this.state.selectedDate ? this.state.selectedDate : '请选择日期'}
        <br />
        <Portal
          component={({ onToggle }) => (
            <DatePicker
              onToggle={onToggle}
              onConfirm={this.handleSelect}
              onValueChanged={this.handleSelect}
              defaultDate={this.state.selectedDate}
              from="1990-02-10"
              to="2010-08-29"
            />
          )}
        >
          {({ onToggle }) => (
            <button
              style={{
                border: '1px solid #ddd',
                padding: '10px 20px',
                background: '#eee',
                borderRadius: '10px'
              }}
              onClick={onToggle}
            >
              datepicker
            </button>
          )}
        </Portal>
      </div>
    );
  }
}

render(<DatePickerContainer />, document.getElementById("root"));
```