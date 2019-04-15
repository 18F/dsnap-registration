import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class Header extends React.Component {
  static propTypes = {
    border: PropTypes.bool,
    className: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
    size: PropTypes.oneOf([ 'sm', 'md', 'lg', 'xl', '2xl' ]),
    text: PropTypes.string,
    type: PropTypes.oneOf([ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
  }

  static defaultProps = {
    type: 'h1',
    size: 'md',
  }

  buildHeader(additionalProps) {
    const { children, text, type } = this.props;
    const elementContent = text ? text : children;

    return React.createElement(`${type}`, { children: elementContent, ...additionalProps });
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
        { this.props.children && this.props.text ? this.props.children : null}
      </div>
    );
  }
}

export default {
  Header
};
