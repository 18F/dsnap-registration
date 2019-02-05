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

export default FormikField;
