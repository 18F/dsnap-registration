import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import Input from 'components/input';
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
      <Field
        name={name}
        render={({ field }) => {
          return (
            <InputComponent
              type={type}
              {...field}
              onChange={onChange || field.onChange}
              {...rest}
            />
          );
        }}
      />
    );
  }
}

const FormGroupLabel = ({ labelText }) => (
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

const FormikInlineFieldGroup = (props) => (
  <div role="group" className="margin-y-4">
    <FormGroupLabel labelText={props.labelText} />
    <FormGroupExplanation text={props.explanation} />
    <div>
      { 
        props.fields.map(({ className, ...field}, index) => (
          <FormikField
            key={`${field.name}.${index}`}
            {...field}
            groupClassName="display-inline-block grid-col-1"
            className={classnames('padding-y-3', className)}
            quietLabel
          />
        ))
      }
    </div>
  </div>
);

class FormikRadioGroup extends React.Component {
  static propTypes = {
    options: PropTypes.array
  }

  render() {
    const { options, explanation, ...rest } = this.props;

    return (
      <div role="group" className="margin-y-4">
        <FormGroupLabel labelText={this.props.labelText} />
        <FormGroupExplanation text={explanation} />
        <div className="margin-top-2">
          {
            this.props.options.map((option, index) => {
              return (
                <FormikField
                  key={`${+new Date()}.${option.label}.${index}`}
                  {...rest}
                  type='radio'
                  radioValue={option.value}
                  labelText={option.label}
                />
              );
            })
          }
        </div>
      </div>
    )
  }
}

export { FormikRadioGroup, FormikInlineFieldGroup };
export default FormikField;
