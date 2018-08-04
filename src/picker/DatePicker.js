import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Picker from './Picker';
import styles from './DatePicker.css';
import { paddingLeft } from './utils';

class DatePicker extends Component {
  static propTypes = {
    fontSize: PropTypes.string,
    defaultDate: PropTypes.string,
    from: PropTypes.string,
    to: PropTypes.string,
    onToggle: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onValueChanged: PropTypes.func.isRequired,
    children: PropTypes.node
  };
  static defaultProps = {
    fontSize: '14px',
    defaultDate: '2000-01-01',
    from: '1900-01-01',
    to: '2100-12-31',
  };
  static DEFAULT_DATE = '2000-01-01';
  static DEFAULT_FROM = '1900-01-01';
  static DEFAULT_TO = '2100-12-31';

  constructor(props) {
    super(props);
    this.state = {
      selectedYear: undefined,
      selectedMonth: undefined,
      selectedDay: undefined,
      year: undefined,
      month: undefined,
      day: undefined
    };
    this.defaultDate = props.defaultDate || DatePicker.DEFAULT_DATE;
    this.defaultFrom = props.from || DatePicker.DEFAULT_FROM;
    this.defaultTo = props.to || DatePicker.DEFAULT_TO;
    [this.minYear, this.minMonth, this.minDay] = this.defaultFrom.split('-');
    [this.maxYear, this.maxMonth, this.maxDay] = this.defaultTo.split('-');
    this.selectedDateValue = undefined;
  }

  componentWillMount() {
    this.init();
  }

  // componentDidUpdate(prevProps, prevState) {
    // const isUpdated = () => {
    //   return (
    //     prevState.selectedYear !== this.state.selectedYear ||
    //     prevState.selectedMonth !== this.state.selectedMonth ||
    //     prevState.selectedDay !== this.state.selectedDay
    //   );
    // };
    // if (isUpdated()) {
    //   this.changeSelectedValue(this.state);
    // }
  // }

  shouldComponentUpdate(nextProps, nextState) {
    // 对比year/month/day数组内容是否完全相同
    return (
      this.state.year.toString() !== nextState.year.toString() ||
      this.state.month.toString() !== nextState.month.toString() ||
      this.state.day.toString() !== nextState.day.toString()
    );
  }

  checkDateRange(defaultDate, from, to) {
    const defaultTimestamp = new Date(defaultDate.replace(/-/g, '/')).getTime();
    const fromTimestamp = new Date(from.replace(/-/g, '/')).getTime();
    const toTimestamp = new Date(to.replace(/-/g, '/')).getTime();

    if (defaultTimestamp < fromTimestamp) {
      return from;
    }
    if (defaultTimestamp > toTimestamp) {
      return to;
    }
    return defaultDate;
  }

  init() {
    // 检查默认日期是否在可选日期范围内
    const finalDefaultDate = this.checkDateRange(
      this.defaultDate,
      this.defaultFrom,
      this.defaultTo
    );
    const [selectedYear, selectedMonth, selectedDay] = finalDefaultDate.split(
      '-'
    );

    this.setState({ selectedYear, selectedMonth, selectedDay });
    this.setYear();
    this.setMonth(selectedYear);
    this.setDay(selectedYear, selectedMonth);
    this.selectedDateValue = `${selectedYear}-${selectedMonth}-${selectedDay}`;
  }

  setYear() {
    let year = [];
    for (let i = this.minYear; i <= this.maxYear; i++) {
      year.push(i.toString());
    }
    this.setState({ year });
  }

  setMonth(year) {
    let month = [];
    let from = 1;
    let to = 12;
    if (year === this.minYear) {
      from = this.minMonth;
    }
    if (year === this.maxYear) {
      to = this.maxMonth;
    }

    for (let i = Number(from); i <= Number(to); i++) {
      const str = paddingLeft(i, 2);
      month.push(str);
    }
    this.setState({ month });
  }

  setDay(year, month) {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    let day = [];
    const month30 = ['01', '03', '05', '07', '08', '10', '12'];
    let len = 30;
    if (month30.indexOf(month) > -1) {
      len = 31;
    }
    if (month === '02' && !isLeapYear) {
      len = 28;
    }
    if (month === '02' && isLeapYear) {
      len = 29;
    }
    let from = 1;
    let to = len;
    if (year === this.minYear && month === this.minMonth) {
      from = this.minDay;
    }
    if (year === this.maxYear && month === this.maxMonth) {
      to = this.maxDay;
    }
    for (let i = Number(from); i <= Number(to); i++) {
      const str = paddingLeft(i, 2);
      day.push(str);
    }
    this.setState({ day });
  }

  handleYearChange = (result) => {
    const { value } = result;
    this.setState({ selectedYear: value });
    this.setMonth(value);
    this.setDay(value, this.state.selectedMonth);
    this.changeSelectedValue(this.state);
  };
  handleMonthChange = (result) => {
    this.setState({ selectedMonth: result.value });
    this.setDay(this.state.selectedYear, result.value);
    this.changeSelectedValue(this.state);
  };
  handleDayChange = (result) => {
    this.setState({ selectedDay: result.value });
    this.changeSelectedValue(this.state);
  };
  changeSelectedValue(state) {
    const { selectedYear, selectedMonth, selectedDay } = state;
    const result = `${selectedYear}-${selectedMonth}-${selectedDay}`;

    this.selectedDateValue = result;
    this.props.onValueChanged(this.selectedDateValue);
  }

  render() {
    return (
      <div
        className={styles.container}
        style={{ fontSize: this.props.fontSize }}
      >
        <div className={styles.header}>
          <button onClick={this.props.onToggle}>取消</button>
          <h3>选择日期</h3>
          <button
            onClick={() => {
              this.props.onToggle();
              this.props.onConfirm(this.selectedDateValue);
            }}
          >
            确定
          </button>
        </div>
        <div className={styles.datepicker}>
          <div className={styles.column}>
            <Picker
              options={this.state.year}
              onScrollChange={this.handleYearChange}
              selectedValue={this.state.selectedYear}
            />
          </div>
          <div className={styles.column}>
            <Picker
              options={this.state.month}
              onScrollChange={this.handleMonthChange}
              selectedValue={this.state.selectedMonth}
            />
          </div>
          <div className={styles.column}>
            <Picker
              options={this.state.day}
              onScrollChange={this.handleDayChange}
              selectedValue={this.state.selectedDay}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DatePicker;
