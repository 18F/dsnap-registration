import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './input.css';
import InputError from './input-error';

const propTypes = {
  className: PropTypes.string,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string,
    })
  ),
  labelClassName: PropTypes.string,
  labelText: PropTypes.string.isRequired,
  labelSecondaryText: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
};

class Input extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { value } = event.target;

    this.props.onChange(value);
  }

  labelClassName() {
    return classNames('usa-label', this.props.labelClassName, {
      'usa-input-error-label': this.props.errors
    });
  }

  fieldClassName() {
    return classNames('usa-input', this.props.className, {
      'usa-input-error': this.props.errors
    });
  }

  formGroupClassName() {
    return classNames('usa-form-group', {
      'usa-form-group-error': this.props.errors
    });
  }

  mapErrors() {
    return this.props.errors && this.props.errors.map((error, index) => {
      return (
        <InputError
          key={`error-${this.props.name}-${index}`}
          message={error.message}
        />
      )
    });
  }

  render() {
    return (
      <div className={this.formGroupClassName()}>
        <label
          className={this.labelClassName()}
          htmlFor={this.props.name}
        >
          <b>{this.props.labelText}</b>
          <p>{this.props.labelSecondaryText}</p>
        </label>
        <input
          type={this.props.type}
          className={this.fieldClassName()}
          name={this.props.name}
          onChange={this.handleChange}
          value={this.props.value}
        />
        { this.mapErrors() }
      </div>
    );
  }
}

Input.propTypes = propTypes;
Input.defaultProps = {
  className: null,
  labelClassName: null,
  labelSecondaryText: null,
  errors: null,
  type: 'text'
};

export default Input;
