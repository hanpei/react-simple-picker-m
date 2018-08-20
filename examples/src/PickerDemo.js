import React, { Component } from 'react';
import { render } from 'react-dom';
import { Picker } from '../../src';
import styles from './index.css';

export default class PickerDemo extends Component {
  state = {
    selectedValue: 'blue',
    selectedDate: ''
  };
  handleScrollChange = result => {
    this.setState({ selectedValue: result.value });
    console.log(this.state);
  };


  render() {
    return (
      <div className={styles.container}>
        <h2>Picker</h2>
        <p>selected: {this.state.selectedValue}</p>
        <Picker
          options={[
            'red',
            'blue',
            'yellow',
            'green',
            'black',
            'white',
            'orange',
            'brown'
          ]}
          onScrollChange={(result) => {
            console.log(result)
            this.setState({selectedValue: result.value})
          }}
          selectedValue={this.state.selectedValue}
        />
      </div>
    );
  }
}

