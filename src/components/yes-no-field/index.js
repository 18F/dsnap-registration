import React from 'react';
import PropTypes from 'prop-types';
import withLocale from 'components/with-locale';
import { FormikRadioGroup } from 'components/formik-field';
import { buildNestedKey } from 'utils';

class YesNoField extends React.Component {
  static propTypes = {
    explanation: PropTypes.bool,
    fieldName: PropTypes.string.isRequired,
    labelObject: PropTypes.object,
    sectionName: PropTypes.string.isRequired
  }

  static defaultProps = {
    labelObject: {},
  }

  prepareProps() {
    const { explanation, ...rest } = this.props;

    let props = { ...rest };

    if (explanation) {
      props = {
        ...props,
        explanation: buildNestedKey(props.sectionName, props.fieldName, 'explanation')
      }
    }
  }

  render() {
    const { t, fieldName, sectionName, labelObject } = this.props;

    return (
      <FormikRadioGroup
        {...this.prepareProps()}
        labelText={t(buildNestedKey(sectionName, fieldName, 'label'))}
        name={buildNestedKey(sectionName, fieldName)}
        options={[
          {
            value: 'yes',
            label: t('general.yes')
          },
          {
            value: 'no',
            label: t('general.no')
          }
        ]}
      />
    );
  }
}

export default withLocale(YesNoField);
