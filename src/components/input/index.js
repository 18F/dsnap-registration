import React from 'react';
import PropTypes from 'prop-types';
import withFormField from 'components/with-form-field'
import './input.css';

const propTypes = {
  autoComplete: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

class Input extends React.Component {
  static propTypes = propTypes

  renderPrefix() {
    if (this.props.prefix) {
      return (
        <div className="input-prefix-wrapper">
          <div className="input-prefix">
            {this.props.prefix}
          </div>
        </div>
      );
    }
    
    return null;
  }

  render() {
    return (
      <React.Fragment>
        { this.renderPrefix() }
        <input
          id={this.props.name}
          autoComplete="new-password"
          type={this.props.type}
          className={this.props.className}
          name={this.props.name}
          onBlur={this.props.onBlur}
          onChange={this.props.onChange}
          onInput={this.props.onInput}
          value={this.props.value}
        />
        { this.props.children }
      </React.Fragment>
    );
  }
}

export default withFormField(Input);

