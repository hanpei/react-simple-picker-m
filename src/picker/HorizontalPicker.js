import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './HorizontalPicker.css';
import { PickerScroller, Scroller } from './scroller';

class HorizontalPicker extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    onScrollChange: PropTypes.func.isRequired,
    selectedValue: PropTypes.string,
    itemHeight: PropTypes.number
  };
  static defaultProps = {
    itemHeight: 60
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedValue: this.props.selectedValue
    };
  }

  componentDidMount() {
    this.pickerEvent = new PickerScroller({
      el: this.pickerNode,
      itemHeight: 60,
      selectedIndex: this.getIndexByValue(),
      onScrollChange: this.handleScrollChange,
      direction: 'x'
    });
  }

  componentWillUnmount() {
    this.pickerEvent.removeEvent(this.pickerNode);
  }
  getIndexByValue() {
    const { selectedValue, options } = this.props;
    if (selectedValue) {
      return options.indexOf(selectedValue);
    } else {
      return 0;
    }
  }

  render() {
    const width = `${this.props.itemHeight}px`;
    return (
      <div className={styles.wrap}>
        <Indicator width={width}/>
        <div
          ref={node => (this.pickerNode = node)}
          className={styles.innerWrap}
        >
          <Items options={this.props.options} width={width} />
        </div>
      </div>
    );
  }
}

const Indicator = ({ width }) => (
  <div className={styles.indicator} style={{ width }} />
);
Indicator.propTypes = {
  width: PropTypes.string.isRequired,
};

export const Items = ({ options, width }) =>
  options.map(value => (
    <div
      className={styles.item}
      style={{ width: width }}
      key={value}
      value={value}
    >
      {value}
    </div>
  ));

export default HorizontalPicker;
