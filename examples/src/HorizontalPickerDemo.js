import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HorizontalPicker } from '../../src';
import styles from './index.css';

const data = (() => {
  let data = [];
  for (let i = 1; i < 30; i++) {
    data.push(i.toString());
  }
  return data;
})();

class HorizontalPickerDemo extends Component {
  state = {
    selectedValue: '1'
  };
  handleScrollChange = result => {
    this.setState({ selectedValue: result.value });
    console.log(this.state);
  };

  render() {
    return (
      <HorizontalPicker
        options={data}
        onScrollChange={result => {
          console.log(result);
          this.setState({ selectedValue: result.value });
        }}
        selectedValue={this.state.selectedValue}
      />
    );
  }
}

export default HorizontalPickerDemo;
