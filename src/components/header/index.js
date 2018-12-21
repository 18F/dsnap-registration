import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './header.css';

const propTypes = {
  text: PropTypes.string.isRequired
};

const Header = ({ text }) => (
  <>
    <header className="usa-header bg-primary-darker padding-1">
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
    <nav className="site-nav-secondary">
      <ul>
        <Link to="/components">component examples</Link>
      </ul>
    </nav>
  </>
);

Header.propTypes = propTypes;

export default Header;
