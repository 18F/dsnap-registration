import React from 'react';
import PropTypes from 'prop-types';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import BasicInfoReview from 'components/review/basic-info';

class ReviewStep extends React.Component {
  static propTypes = {
    handleChange: PropTypes.func,
    registerStep: PropTypes.func,
    sectionName: PropTypes.string,
  }

  render() {
    const { handleChange, sectionName, t } = this.props;
    
    return (
      <Wizard.Step
        header={t(`${sectionName}.header`)}
        registerStep={this.props.registerStep}
        modelName="review"
      >
        <BasicInfoReview />
      </Wizard.Step>
    );
  }
}

export { ReviewStep };
export default withLocale(ReviewStep);
