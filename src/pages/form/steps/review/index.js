import React from 'react';
import PropTypes from 'prop-types';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import Review from 'components/review';


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
        <Review name="info"></Review>
      </Wizard.Step>
    );
  }
}

export { Review };
export default withLocale(ReviewStep);
