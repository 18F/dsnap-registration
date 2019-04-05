import React from 'react';
import { withMachineState } from 'components/fsm';
import withLocale from 'components/with-locale';
import ReviewTable from 'components/review-table';
import { getFullName } from 'models/person';
import { getApplicant } from 'models/household';

class EligiblePage extends React.Component {
  getRegistrationData() {
    const { t, context } = this.props;

    return [{
      name: `${t('eligibility.registration.name')}:`,
      data: getFullName(getApplicant(context.household)),
    }, {
      name: `${t('eligibility.registration.id')}:`,
      data: context.registration.id
    }];
  }

  render() {
    const { t } = this.props;
 
    return (
      <div>
        <div className="border-bottom-1px border-base-lighter margin-bottom-4">
          <h1 className="font-sans-2xl">
            { t(`eligibility.${this.props.type}.header`)}
          </h1>
        </div>
        <p className="font-sans-lg">
          { t(`eligibility.${this.props.type}.lede`)}
        </p>
        <div className="grid-col-6 margin-top-4">
          <ReviewTable primaryData={this.getRegistrationData()} />
        </div>
      </div>
    );
  }
}

export default withMachineState(withLocale(EligiblePage));
