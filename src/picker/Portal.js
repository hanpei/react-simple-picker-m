import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import styles from './Portal.css';
import CSSTransition from 'react-transition-group/CSSTransition';

export default class Portal extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    component: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = { visible: false };
    this.modalDiv = document.createElement('div');
    document.body.appendChild(this.modalDiv);
  }

  componentWillUnmount() {
    document.body.removeChild(this.modalDiv);
  }

  onToggle = () => {
    this.setState(({ visible }) => ({ visible: !visible }));
  };

  render() {
    const { visible } = this.state;
    return (
      <Fragment>
        {this.props.children({ onToggle: this.onToggle })}
        {createPortal(
          <Fragment>
            {visible && <div onClick={this.onToggle} className={styles.layer} />}
            <Slide in={visible}>
              {this.props.component({
                visible,
                onToggle: this.onToggle,
              })}
            </Slide>
          </Fragment>,
          this.modalDiv,
        )}
      </Fragment>
    );
  }
}

// slide animation
export const Slide = ({ in: inProp, children }) => (
  <CSSTransition
    in={inProp}
    timeout={200}
    unmountOnExit
    classNames={{
      enter: styles.enter,
      enterActive: styles.enterActive,
      exit: styles.exit,
      exitActive: styles.exitActive,
    }}
  >
    {children}
  </CSSTransition>
);
Slide.propTypes = {
  in: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};
