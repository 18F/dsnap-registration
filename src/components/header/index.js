import React from 'react';
import PropTypes from 'prop-types';
import './header.css';

const propTypes = {
  text: PropTypes.string.isRequired
};

const Header = ({ text }) => (
  <header className="usa-header bg-primary-darker padding-1">
    <div className="usa-navbar">
      <div className="usa-logo margin-top-0">
        <em className="usa-logo-text text-white">
          <span className="site-title">
            { text }
          </span>
        </em>
      </div>
    </div>
  </header>
);

Header.propTypes = propTypes;

export default Header;
