import React from 'react';
import PropTypes from 'prop-types';
import withLocale from 'components/with-locale';
import { FormikRadioGroup } from 'components/formik-field';
import { buildNestedKey } from 'utils';

class YesNoField extends React.Component {
  static propTypes = {
    explanation: PropTypes.bool,
    fieldName: PropTypes.string.isRequired,
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

    return props
  }

  render() {
    // TODO: remove this auto labeling, clean up coupling between data model and translation
    const { props } = this;
    const { t, fieldName, sectionName } = props;
    const labelText = (fieldName && t(buildNestedKey(sectionName, fieldName, 'label'))) ||
      props.labelText;
    const nName = (fieldName && buildNestedKey(sectionName, fieldName)) ||
      props.name;

    return (
      <FormikRadioGroup
        {...this.prepareProps()}
        labelText={labelText}
        name={nName}
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
