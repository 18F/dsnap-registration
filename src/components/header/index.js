import React from 'react';
import PropTypes from 'prop-types';
import './header.css';

const propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired
};

const Header = ({ text, className }) => (
  <>
    <header className={`usa-header ${className} padding-x-1 padding-bottom-2`}>
      <div className="usa-navbar">
        <div className="usa-logo">
          <em className="usa-logo-text text-white">
            <span className="site-title font-sans-lg">
              { text }
            </span>
          </em>
        </div>
      </div>
    </header>
  </>
);

Header.propTypes = propTypes;
Header.defaultProps = {
  className: 'bg-primary-darker'
};

export default Header;
