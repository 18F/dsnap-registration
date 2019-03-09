import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, getIn } from 'formik';

const withFormField = (Component) => {
  class FormFieldImpl extends React.Component {
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

    render() {
      const {
        labelText,
        quietLabel,
        explanation,
        className,
        fieldClassName,
        groupClassName,
        labelClassName,
        ...rest
      } = this.props;

      return (
        <div className={this.formGroupClassName()}>
          <label
            className={this.labelClassName()}
            htmlFor={this.props.name}
          >
            {
              quietLabel ? labelText :
              <p className="margin-bottom-1">
                <b>{ labelText }</b>
              </p>
            }
            {
              explanation ?
              <span className="text-base">
                { explanation }
              </span> : null
            }
          </label>
          <Component className={this.fieldClassName()} {...rest} />
        </div>
      )
    }
  }

  return connect(FormFieldImpl);
}

export default withFormField;
