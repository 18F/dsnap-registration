import React from 'react';
import PropTypes from 'prop-types';
import CollapsibleContent from './collapsible-content';

const propTypes = {
  body: PropTypes.string,
  className: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  header: PropTypes.string.isRequired,
  name: PropTypes.string,
};

class Collapsible extends React.Component {
  static propTypes = propTypes;
  static defaultProps = { body: '' }

  state = {
    collapsed: true
  }

  handleClick = (event) => {
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
            className="usa-accordion-button hover:text-underline bg-mint hover:bg-mint text-white hover:text-white"
            aria-expanded={!collapsed}
            aria-controls={this.props.name}
            onClick={this.handleClick}
          >
            <span>{ this.props.header }</span>
          </button>
        </h2>
        <CollapsibleContent id={this.props.name} collapsed={collapsed}>
          { this.props.children ? this.props.children : this.props.body }
        </CollapsibleContent>
      </div>
    );
  }
}

export default Collapsible;
