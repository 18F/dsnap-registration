import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class Header extends React.Component {
  static propTypes = {
    border: PropTypes.bool,
    className: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
    type: PropTypes.oneOf([ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
    size: PropTypes.oneOf([ 'sm', 'md', 'lg', 'xl', '2xl' ]),
  }

  static defaultProps = {
    type: 'h1',
    size: 'md',
  }

  buildHeader(additionalProps) {
    const { children, type } = this.props;
    return React.createElement(`${type}`, { children, ...additionalProps });
  }

  className() {
    const { border, size } = this.props;

    return classnames(`font-sans-${size} padding-bottom-05`, {
      'border-bottom-1px': border,
      'border-base-lighter': border,
    });
  }

  render() {
    if (!this.props.children) {
      return null;
    }

    return (
      <div className={this.className()}>
        { this.buildHeader({ className: classnames(this.props.className) }) }
      </div>
    );
  }
}

export default {
  Header
};
