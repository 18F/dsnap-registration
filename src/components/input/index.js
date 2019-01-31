import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ErrorMessage, connect, getIn } from 'formik';
import './input.css';
import InputError from 'components/error';

const propTypes = {
  autoComplete: PropTypes.oneOf([null, 'off']),
  className: PropTypes.string,
  error: PropTypes.string,
  labelClassName: PropTypes.string,
  labelText: PropTypes.string.isRequired,
  explanation: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
};

class Input extends React.Component {
  static propTypes = propTypes

  static defaultProps = {
    autocomplete: 'off',
    className: null,
    labelClassName: null,
    explanation: null,
    type: 'text'
  }

  labelClassName() {
    return classNames('usa-label margin-bottom-2', this.props.labelClassName, {
      'usa-input-error-label': this.hasError()
    });
  }

  fieldClassName() {
    return classNames('usa-input', this.props.className, {
      'usa-input-error': this.hasError()
    });
  }

  formGroupClassName() {
    return classNames('usa-form-group', {
      'usa-form-group-error': this.hasError()
    });
  }

  hasError() {
    const { formik: { errors }, name } = this.props;

    return !!getIn(errors, name)
  }

  render() {
    const { name } = this.props;
    return (
      <div className={this.formGroupClassName()}>
        <label
          className={this.labelClassName()}
          htmlFor={name}
        >
          <p className="margin-bottom-1">
            <b>{this.props.labelText}</b>
          </p>
          <span className="text-base">
            {this.props.explanation}
          </span>
        </label>
        <input
          autoComplete={this.props.autoComplete}
          type={this.props.type}
          className={this.fieldClassName()}
          name={name}
          onChange={this.props.onChange}
          onBlur={this.props.onBlur}
          value={this.props.value}
        />
        <ErrorMessage name={name}>
          { message => <InputError message={message} /> }
        </ErrorMessage>
      </div>
    );
  }
}

export default connect(Input);
