import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './header.css';

const propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired
};

const Header = ({ text, className }) => (
  <>
    <header className={`usa-header ${className}  padding-1`}>
      <div className="usa-navbar">
        <div className="usa-logo margin-y-2">
          <Link to="/">
            <em className="usa-logo-text text-white">
              <span className="site-title font-sans-lg">
                { text }
              </span>
            </em>
          </Link>
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
