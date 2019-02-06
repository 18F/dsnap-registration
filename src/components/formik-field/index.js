import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import Input from 'components/input';
import Dropdown from 'components/dropdown';
import RadioCheckbox from 'components/radio-checkbox';

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

class FormikRadioGroup extends React.Component {
  static propTypes = {
    options: PropTypes.array
  }

  render() {
    const { options, ...rest } = this.props;

    return (
      <div className="margin-y-4">
        <label className="usa-label margin-bottom-2" htmlFor={this.props.name}>
          <p>
            <b>{this.props.labelText}</b>
          </p>
        </label>
        {
          this.props.options.map((option, index) => {
            return (
              <FormikField
                key={`${+new Date}.${option.label}.${index}`}
                {...rest}
                type='radio'
                radioValue={option.value}
                labelText={option.label}
              />
            );
          })
        }
      </div>
    )
  }
}

export { FormikRadioGroup };
export default FormikField;
