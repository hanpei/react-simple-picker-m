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