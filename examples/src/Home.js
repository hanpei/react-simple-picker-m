import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Home = props => {
  return (
    <div>
      <h2>Demo</h2>
      <ul>
        <li>
          <Link to="/picker">Single Picker Demo</Link>
        </li>
        <li>
          <Link to="/datepicker">DatePicker Demo</Link>
        </li>
        <li>
          <Link to="/horizontal-picker">Horizontal DatePicker Demo</Link>
        </li>
      </ul>
    </div>
  );
};


export default Home;
