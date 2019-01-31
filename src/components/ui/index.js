import React from 'react';
import PropTypes from 'prop-types';

class Header extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf([ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
  }

  buildHeader(additionalProps) {
    const { children, type } = this.props;
    return React.createElement(`${type}`, { children, ...additionalProps });
  }

  render() {
    if (!this.props.children) {
      return null;
    }

    return (
      <div className="border-bottom-1px border-base-lighter margin-bottom-4">
        { this.buildHeader({ className: 'font-sans-xl' }) }
      </div>
    );
  }
}

export default {
  Header
};
