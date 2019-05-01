import React from 'react';
import { withMachineState, withMachineContext } from 'components/fsm';
import withLocale from 'components/with-locale';
import ReviewTable from 'components/review-table';
import Button from 'components/button';

class EligiblePage extends React.Component {
  componentWillMount() {
    if (!this.props.context.registration) {
      this.handleReset();
    }
  }

  componentWillUnmount() {
    this.handleReset();
  }

  handleReset = () => {
    this.props.fsmTransition({
      command: 'RESET'
    });
  }

  getRegistrationData() {
    const { t, context } = this.props;

    return [{
      name: `${t('eligibility.registration.name')}:`,
      data: context.registration.applicantName,
    }, {
      name: `${t('eligibility.registration.id')}:`,
      data: context.registration.id
    }];
  }

  render() {
    const { t, context } = this.props;

    if (!context.registration) {
      return null;
    }
 
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
        <p className="margin-y-2">
          <b>{ t(`eligibility.${this.props.type}.body`)}</b>
        </p>
        <div className="grid-col-6 margin-top-4">
          <ReviewTable primaryData={this.getRegistrationData()} />
        </div>
        <Button type="button" onClick={this.handleReset}>
          { t('eligibility.action') }
        </Button>
      </div>
    );
  }
}

export default withMachineContext(withMachineState(withLocale(EligiblePage)));
