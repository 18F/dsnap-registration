import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ErrorMessage, connect, getIn } from 'formik';
import './input.css';
import InputError from 'components/error';

const propTypes = {
  autoComplete: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
  groupClassName: PropTypes.string,
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
    className: null,
    labelClassName: null,
    explanation: null,
    type: 'text'
  }

  labelClassName() {
    return classNames('usa-label', this.props.labelClassName, {
      'usa-input-error-label': this.hasError(),
      'margin-bottom-2': !this.props.quietLabel,
      'margin-bottom-1': this.props.quietLabel,
    });
  }

  fieldClassName() {
    return classNames('usa-input tablet:grid-col-6', this.props.className, {
      'usa-input-error': this.hasError()
    });
  }

  formGroupClassName() {
    return classNames('usa-form-group', this.props.groupClassName, {
      'usa-form-group-error': this.hasError()
    });
  }

  hasError() {
    const { formik: { errors }, name } = this.props;

    return !!getIn(errors, name)
  }

  // TODO: input components and their wrappers need to be cleaned up

  render() {
    const { name, labelText } = this.props;
    return (
      <div className={this.formGroupClassName()}>
        <label
          className={this.labelClassName()}
          htmlFor={name}
        >
          {
            this.props.quietLabel ? labelText :
            <p className="margin-bottom-1">
              <b>{labelText}</b>
            </p>
          }
          {
            this.props.explanation ?
            <span className="text-base">
              {this.props.explanation}
            </span> : null
          }
        </label>
        <input
          autoComplete="new-password"
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

