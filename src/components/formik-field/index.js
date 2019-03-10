import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, FastField } from 'formik';
import Input from 'components/input';
import InputError from 'components/error';
import Dropdown from 'components/dropdown';
import RadioCheckbox from 'components/radio-checkbox';
import classnames from 'classnames';

const inputTypes = (type) => {
  switch(type) {
    case 'text': return Input;
    case 'select': return Dropdown;
    case 'radio':
    case 'checkbox':
      return RadioCheckbox;
    default: return Input
  }
};

class FormikField extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    type: PropTypes.string,
  }

  render() {
    const { name, onChange, type, ...rest } = this.props;
    const InputComponent = inputTypes(type);

    return (
      <FastField
        name={name}
        render={({ field }) => {
          return (
            <InputComponent
              id={name}
              type={type}
              {...field}
              onChange={onChange || field.onChange}
              {...rest}
            >
              <ErrorMessage name={name}>
                { message => <InputError message={message} /> }
              </ErrorMessage>
            </InputComponent>
          );
        }}
      />
    );
  }
}

const FormGroupLabel = ({ labelText }) => (
  !labelText ? null :
  <div className="usa-label margin-bottom-2">
    <p>
      <b>{labelText}</b>
    </p>
  </div>
);

const FormGroupExplanation = ({ text }) =>
  !text ? null :
  <span className="text-base">
    {text}
  </span>;

const FormikFieldGroup = ({
  explanation,
  fields = [],
  fieldGroupClassname,
  inline,
  labelText,
  Component = FormikField
}) => (
  <div role="group" className={classnames('margin-y-4', fieldGroupClassname)}>
    <FormGroupLabel labelText={labelText} />
    <FormGroupExplanation text={explanation} />
    <div className="margin-top-2">
      { 
        fields.map(({ className, ...field}, index) => {
          const FinalComponent = field.Component ? field.Component : Component;

          return (
            <FinalComponent
              key={`${field.name}.${index}`}
              {...field}
              groupClassName={classnames({ 'display-inline-block grid-col-2': inline })}
              className={classnames('padding-y-3', className)}
              quietLabel
            />
          );
        })
      }
    </div>
  </div>
);

class FormikRadioGroup extends React.Component {
  static propTypes = {
    options: PropTypes.array
  }

  render() {
    const { options, explanation, inline, ...rest } = this.props;

    return (
      <div role="group" className="margin-y-4">
        <FormGroupLabel labelText={this.props.labelText} />
        <FormGroupExplanation text={explanation} />
        <div className="margin-top-2">
          <fieldset className="usa-fieldset">
            {
              this.props.options.map((option, index) => {
                return (
                  <FormikField
                    key={`${rest.name}.${option.label}.${index}`}
                    {...rest}
                    type='radio'
                    radioValue={option.value}
                    labelText={option.label}
                    groupClassName={classnames({
                      'border radius-md border-base-light margin-right-2 display-inline-block': inline
                    })}
                  />
                );
              })
            }
          </fieldset>
        </div>
      </div>
    )
  }
}

export { FormikRadioGroup, FormikFieldGroup };
export default FormikField;
