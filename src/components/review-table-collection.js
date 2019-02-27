import React from 'react';
import PropTypes from 'prop-types';

class ReviewTableCollection extends React.Component {
  static propTypes = {
    fallback: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]).isRequired
  }

  renderFallback() {
    return (
      <div className="grid-row bg-base-lighter padding-2">
        <div className="grid-col-fill">
          <h3 className="margin-y-0">
            { this.props.fallback }
          </h3>
        </div>
      </div>
    );
  }

  render() {
    return !this.props.children.length ?
      this.renderFallback() :
      <div className="margin-bottom-4">
        { this.props.children }
      </div>
  }
}

export default ReviewTableCollection;
