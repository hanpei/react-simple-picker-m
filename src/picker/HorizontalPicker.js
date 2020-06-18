import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './HorizontalPicker.css';
import { PickerScroller, Scroller } from './scroller';

class HorizontalPicker extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    onScrollChange: PropTypes.func.isRequired,
    selectedValue: PropTypes.string,
    itemWidth: PropTypes.number,
    offsetLeft: PropTypes.number,
  };

  static defaultProps = {
    // picker宽度
    itemWidth: 60,
    // 为了中间对齐的偏移
    offsetLeft: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedValue: this.props.selectedValue,
    };
  }

  componentDidMount() {
    this.pickerEvent = new PickerScroller({
      el: this.pickerNode,
      itemHeight: this.props.itemWidth, // PickerScroller竖转横，命名没改
      selectedIndex: this.getIndexByValue(),
      onScrollChange: this.handleScrollChange,
      direction: 'x',
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
    const width = `${this.props.itemWidth}px`;
    const left = `${this.props.offsetLeft}px`;
    return (
      <div className={styles.wrap}>
        <Indicator width={width} />
        <div
          ref={(node) => (this.pickerNode = node)}
          className={styles.innerWrap}
          style={{ left }}
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
  options.map((value) => (
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
