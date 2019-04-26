import React from 'react';
import PropTypes from 'prop-types';
import withUpdateable from 'components/with-updateable';
import withLocale from 'components/with-locale';
import FormikField from 'components/formik-field';

class EBTSection extends React.Component {
  static propTypes = {
    formik: PropTypes.shape({
      values: PropTypes.object
    }),
    handleUpdate: PropTypes.func,
    t: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
  }

  handleBlur = (event, field, formik) => {
    const hasError = this.validateEBT(field.value);

    if (!hasError) {
      this.props.handleUpdate(event, field, formik);
    }
  }

  validateEBT = (value) => {
    let message = '';

    if (!/[\d]{16}/.test(value)) {
      message = 'EBT input must be a 16 digit number.';
    }

    return message;
  }

  render() {
    return (
      <section className="margin-bottom-4">
        <div className="border-bottom-1px border-base-lighter margin-bottom-2">
          <div className="grid-row margin-bottom-05">
            <h2
              className="margin-0 grid-col-fill text-bottom display-inline-block"
              style={{ alignSelf: 'flex-end' }}
            >
              { this.props.title }
            </h2>
          </div>
        </div>
        <FormikField
          labelText={this.props.t('worker.review.ebt.label')}
          name="basicInfo.ebtCardNumber"
          validate={this.validateEBT}
          onBlur={this.handleBlur}
        />
      </section>
    );
  }
}

export default withUpdateable(withLocale(EBTSection));
