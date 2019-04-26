import React from 'react';
import PropTypes from 'prop-types';
import CollapsibleContent from './collapsible-content';

const propTypes = {
  body: PropTypes.string,
  buttonClassName: PropTypes.string,
  gridClassName: PropTypes.string,
  header: PropTypes.string.isRequired,
  name: PropTypes.string,
};

class Collapsible extends React.Component {
  static propTypes = propTypes;
  static defaultProps = {
    body: '',
    buttonClassName: 'bg-primary-light hover:bg-primary-light',
    collapsed: true,
    gridClassName: 'tablet:grid-col-6',
  }

  state = {
    collapsed: this.props.collapsed,
  }

  handleClick = (event) => {
    event.preventDefault();

    const collapsed = this.state.collapsed;

    this.setState({ collapsed: collapsed ? false : true }); 
  }

  render() {
    const { collapsed } = this.state;

    return(
      <div className={`usa-accordion ${this.props.gridClassName}`}>
        <h2 className="usa-accordion-heading">
          <button
            className={`usa-accordion-button hover:text-underline ${this.props.buttonClassName}`}
            aria-expanded={!collapsed}
            aria-controls={this.props.name}
            onClick={this.handleClick}
          >
            <span>{ this.props.header }</span>
          </button>
        </h2>
        <CollapsibleContent id={this.props.name} collapsed={collapsed} className={this.props.contentClassName}>
          { this.props.children ? this.props.children : this.props.body }
        </CollapsibleContent>
      </div>
    );
  }
}

export default Collapsible;
