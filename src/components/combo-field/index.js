import React from 'react';
import { getIn } from 'formik';
import FormikField from 'components/formik-field';
import Wizard from 'components/wizard';
import './combo-field.scss';

// TODO: Consider with withFormik HOC to improve this component
// and reduce the amount of confusing prop-passing it requires

// TODO: this is shared with the currency field.
// Investigate if this can be merged with the currency field
const isNotDigit = /[^\d]/;

class ComboField extends React.Component {
  handleChange = (event) => {
    const { name, value } = event.target;

    if (isNotDigit.test(value)) {
      this.props.onChange(name, value.split(isNotDigit)[0])
    } else {
      this.props.onChange(name, value);
    }
  }

  renderTextInput() {
    return (
        <FormikField
          className="desktop:grid-col-2"
          groupClassName="combo-field"
          name={this.props.comboName}
          onChange={this.handleChange}
          labelText={this.props.explanation}
          quietLabel={this.props.quietLabel}
          prefix={this.props.prefix}
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
