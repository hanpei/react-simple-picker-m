import React, { Component } from 'react';
import { render } from 'react-dom';
import { DatePicker, Portal, Picker } from '../../src';
import styles from './index.css';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom';
import PickerDemo from './PickerDemo';
import DatePickerDemo from './DatePickerDemo';
import HorizontalPickerDemo from './HorizontalPickerDemo';
import Home from './Home';

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
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/picker" component={PickerDemo} />
            <Route path="/datepicker" component={DatePickerDemo} />
            <Route path="/horizontal-picker" component={HorizontalPickerDemo} />
          </Switch>
        </Router>
      </div>
    );
  }
}

render(<DatePickerContainer />, document.getElementById('root'));
