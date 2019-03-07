import React from 'react';
import PropTypes from 'prop-types';
import withLocale from 'components/with-locale';
import { FormikRadioGroup } from 'components/formik-field';

class YesNoField extends React.Component {
  static propTypes = {
    explanation: PropTypes.bool,
  }

  static defaultProps = {
    labelObject: {},
  }

  render() {
    const { t, ...rest } = this.props;

    return (
      <FormikRadioGroup
        {...rest}
        inline
        options={[
          {
            value: true,
            label: t('general.yes')
          },
          {
            value: false,
            label: t('general.no')
          }
        ]}
      />
    );
  }
}

export default withLocale(YesNoField);
