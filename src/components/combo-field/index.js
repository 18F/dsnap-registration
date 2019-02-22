import React from 'react';
import { getIn } from 'formik';
import FormikField from 'components/formik-field';
import Wizard from 'components/wizard';
import './combo-field.scss';

// TODO: Consider with withFormik HOC to improve this component
// and reduce the amount of confusing prop-passing it requires

class ComboField extends React.Component {
  renderTextInput() {
    return (
        <FormikField
          className="desktop:grid-col-2"
          groupClassName="combo-field"
          name={this.props.comboName}
          onChange={this.props.onChange}
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
          return (
            <React.Fragment>
              <FormikField {...this.props} />
              { getIn(values, this.props.name) ? this.renderTextInput() : null }
            </React.Fragment>
          );
        }}
      </Wizard.Context>
    );
  }
}

export default ComboField;
