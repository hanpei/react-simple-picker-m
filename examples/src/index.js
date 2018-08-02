import React, { Component } from 'react';
import { render } from 'react-dom';
import { DatePicker, Portal, Picker } from '../../src';
import styles from './index.css';

class DatePickerContainer extends Component {
  state = {
    selectedValue: 'blue',
    selectedDate: ''
  };
  handleScrollChange = result => {
    this.setState({ selectedValue: result.value });
    console.log(this.state);
  };

  handleSelect = value => {
    console.log(value);
    this.setState({
      selectedDate: value
    });
  };

  render() {
    return (
      <div className={styles.container}>
        <h3>Picker</h3>
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
        <br />
        <br />
        <h3>DatePicker</h3>
        <p>selected: {this.state.selectedDate ? this.state.selectedDate : 'none'}</p>
        <br />
        <Portal
          component={({ onToggle }) => (
            <DatePicker
              fontSize="20px"
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
              click
            </button>
          )}
        </Portal>
      </div>
    );
  }
}

render(<DatePickerContainer />, document.getElementById('root'));
