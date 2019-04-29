import React from 'react';
import PropTypes from 'prop-types';
import withLocale from 'components/with-locale';
import { FormikFieldDateGroup } from 'components/formik-field';

const translationPath = 'identity.personalInfo.dob';

class DateInput extends React.Component {
  static propTypes = {
    memberIndex: PropTypes.number.isRequired,
    handleChange: PropTypes.func
  }

  static defaultProps = {
    handleChange: null
  }
 
  render() {
    const { memberIndex, handleChange, t, ...rest } = this.props;

    return (
      <FormikFieldDateGroup
        inline
        showError={false}
        name="dob"
        labelText={t(`${translationPath}.label`)}
        explanation={t(`${translationPath}.explanation`)}
        fields={[{
          name: `household.members.${memberIndex}.dob.month`,
          onChange: handleChange,
          labelText: t(`${translationPath}.month`),
        }, {
          name: `household.members.${memberIndex}.dob.day`,
          labelText: t(`${translationPath}.day`),
          onChange: handleChange
        }, {
          name: `household.members.${memberIndex}.dob.year`,
          labelText: t(`${translationPath}.year`),
          onChange: handleChange,
          className: 'tablet:grid-col-8'
        }]}
        {...rest}
      />
    );
  }
}

export default withLocale(DateInput);
