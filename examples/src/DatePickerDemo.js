import React, { Component } from 'react';
import { render } from 'react-dom';
import { DatePicker, Portal } from '../../src';
import styles from './index.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export default class DatePickerDemo extends Component {
  state = {
    selectedDate: '2020-02-02',
  };

  handleSelect = (value) => {
    this.prevDate = this.state.selectedDate;

    this.setState({
      selectedDate: value,
    });
  };

  cancelSeclect = () => {
    this.setState({
      selectedDate: this.prevDate,
    });
  };

  render() {
    return (
      <div className={styles.container}>
        <h2>DatePicker</h2>
        <p>
          selected: {this.state.selectedDate ? this.state.selectedDate : 'none'}
        </p>
        <br />
        <Portal
          component={({ onToggle }) => (
            <DatePicker
              fontSize="20px"
              onToggle={onToggle}
              onConfirm={this.handleSelect}
              onCancel={() => {
                this.cancelSeclect();
                onToggle();
              }}
              onValueChanged={this.handleSelect}
              defaultDate={this.state.selectedDate}
              from="1990-02-10"
              to="2030-08-29"
            />
          )}
        >
          {({ onToggle }) => (
            <button
              style={{
                border: '1px solid #ddd',
                padding: '10px 20px',
                background: '#eee',
                borderRadius: '10px',
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
