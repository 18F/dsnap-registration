import React from 'react';
import PropTypes from 'prop-types';
import CollapsibleContent from './collapsible-content';

const propTypes = {
  headerContent: PropTypes.string.isRequired,
  text: PropTypes.string,
};

class Collapsible extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();

    const collapsed = this.state.collapsed;

    this.setState({ collapsed: collapsed ? false : true }); 
  }

  render() {
    const { collapsed } = this.state;

    return(
      <div className="usa-accordion">
        <h2 className="usa-accordion-heading">
          <button
            className="usa-accordion-button hover:text-underline"
            aria-expanded={!collapsed}
            aria-controls="a1"
            onClick={this.handleClick}
          >
            <span>{ this.props.headerContent }</span>
          </button>
        </h2>
        <CollapsibleContent collapsed={collapsed}>
          { this.props.children ? this.props.children : this.props.text }
        </CollapsibleContent>
      </div>
    );
  }
}

Collapsible.propTypes = propTypes;
Collapsible.defaultProps = {
  text: ''
};

export default Collapsible;
