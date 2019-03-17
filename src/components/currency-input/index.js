import React from 'react';
import FormikField from 'components/formik-field';

class CurrencyInput extends React.Component {
  render() {
    return (
      <FormikField
        className="desktop:grid-col-2"
        groupClassName="currency-field"
        prefix="$"
        {...this.props}    
      />
    );
  }
}

export default CurrencyInput;
