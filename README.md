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

