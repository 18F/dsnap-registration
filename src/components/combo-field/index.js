import React from 'react';
import { getIn } from 'formik';
import FormikField from 'components/formik-field';
import Wizard from 'components/wizard';
import CurrencyInput from 'components/currency-input';
import './combo-field.scss';

// TODO: Consider with withFormik HOC to improve this component
// and reduce the amount of confusing prop-passing it requires

class ComboField extends React.Component {
  renderTextInput() {
    return (
      <CurrencyInput
        onChange={this.props.onChange}
        groupClassName="combo-field"
        name={this.props.comboName}
        labelText={this.props.explanation}
        quietLabel={this.props.quietLabel}
      />
    );
  }

  render() {
    return (
      <Wizard.Context>
        {(values) => {
          const { explanation, ...rest} = this.props;

          return (
            <React.Fragment>
              <FormikField {...rest} />
              { getIn(values, this.props.name) ? this.renderTextInput() : null }
            </React.Fragment>
          );
        }}
      </Wizard.Context>
    );
  }
}

export default ComboField;
