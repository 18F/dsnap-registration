import React from 'react';
import FormikField from 'components/formik-field';

class CurrencyInput extends React.Component {
  handleChange = (event) => {
    const { name, value } = event.target;

    this.props.onChange(name, value.replace(/[^\d]/g, ''));
  }

  render() {
    const { onChange, ...rest } = this.props;
    return (
      <FormikField
        className="desktop:grid-col-2"
        groupClassName="currency-field"
        prefix="$"
        onChange={this.handleChange}
        {...rest}    
      />
    );
  }
}

export default CurrencyInput;
