import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Picker.css';
import { PickerScroller } from './scroller';

class Picker extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    onScrollChange: PropTypes.func.isRequired,
    selectedValue: PropTypes.string,
    itemHeight: PropTypes.number
  };
  static defaultProps = {
    itemHeight: 33
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: this.getIndexByValue(),
      selectedValue: this.props.selectedValue
    };

    this.handleScrollChange = this.handleScrollChange.bind(this);
  }

  componentDidMount() {
    this.pickerEvent = new PickerScroller({
      el: this.pickerNode,
      itemHeight: this.props.itemHeight,
      selectedIndex: this.getIndexByValue(),
      onScrollChange: this.handleScrollChange
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.options.length !== this.props.options.length) {
      const i = this.updateIndexByValue(
        this.state.selectedValue,
        prevState.selectedIndex
      );
      this.pickerEvent.update(i);
    }
    // TODO: 可能需要判断选项数相同，但是值变化的情况
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

  updateIndexByValue(currentValue, prevIndex) {
    const index = this.props.options.indexOf(currentValue);
    const maxIndex = this.props.options.length - 1;
    // 更新后的options中找到的value所在的index
    if (index > -1) {
      return index;
    } else {
      // 更新后的options中找不到value
      if (prevIndex > maxIndex) {
        // 前一个索引大于更新后的option的maxIndex ，定位到maxIndex
        return maxIndex;
      } else {
        // 前一个索引小于更新后的option的maxIndex, 定位到更新后的第一个
        return 0;
      }
    }
  }

  handleScrollChange(index) {
    const value = this.props.options[index];

    this.props.onScrollChange({ value, index });
    this.setState({
      selectedIndex: index,
      selectedValue: value
    });
  }

  render() {
    const height = `${this.props.itemHeight}px`;
    const top = `${100 - this.props.itemHeight / 2 - 1}px`;

    return (
      <div className={styles.wrap}>
        <div className={styles.view} />
        <Indicator height={height} top={top} />
        <div
          ref={(node) => (this.pickerNode = node)}
          className={styles.innerWrap}
        >
          <Items options={this.props.options} height={height} />
        </div>
      </div>
    );
  }
}

const Indicator = ({ height, top }) => (
  <div className={styles.indicator} style={{ height, marginTop: top }} />
);
Indicator.propTypes = {
  height: PropTypes.string.isRequired,
  top: PropTypes.string.isRequired
};

export const Items = ({ options, height }) =>
  options.map((value) => (
    <div
      style={{ height: height, lineHeight: height }}
      key={value}
      value={value}
    >
      {value}
    </div>
  ));

export default Picker;
