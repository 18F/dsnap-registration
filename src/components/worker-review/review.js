import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import withLocale from 'components/with-locale';
import UI from 'components/ui';
import SnapshotReview from 'components/snapshot-review';
import { getApplicant } from 'models/household';
import { getFullName } from 'models/person';

class EligibilityDisplay extends React.Component {
  static propTypes = {
    eligibility: PropTypes.shape({
      eligible: PropTypes.bool,
      findings: PropTypes.arrayOf(
        PropTypes.shape({
          rule: PropTypes.string,
          succeeded: PropTypes.bool,
          text: PropTypes.string
        })
      ),
      metrics: PropTypes.shape({
        allotment: PropTypes.number
      }),
      state: PropTypes.string,
    }).isRequired
  }

  eligibleClassName(eligible) {
    return eligible ? 'text-green' : 'text-red';
  }

  render() {
    const { eligibility } = this.props;
    const eligibleClassName = this.eligibleClassName(eligibility.eligible);

    return (
      <section className="grid-col padding-4 bg-accent-warm-lighter text-black">
        <div className="font-sans-lg margin-bottom-2">
          <span>
            Based on the information below, this applicant appears to be:
          </span>
          <p className={eligibleClassName}>
            <b>
              { eligibility.eligible ? 'Eligible' : 'Ineligible' }
            </b>
          </p>
        </div>
        <p className="font-sans-md margin-top-4 margin-bottom-2">
          <b>Findings</b>
        </p>
        <ul className="add-list-reset fa">
          {
            eligibility.findings.map((finding, index) => {
              const listItemClass = classnames('margin-bottom-2 margin-left-2', {
                'success': finding.succeeded,
                'failure': !finding.succeeded,
              });

              return (
                <li
                  key={`findings.${index}`}
                  className={listItemClass}
                >
                  { finding.text }
                </li>
              )
            })
          }
        </ul>
      </section>
    );
  }
}

class WorkerReview extends React.Component {
  componentDidMount() {
    const { machineState: { currentRegistration } } = this.props;

    if (currentRegistration === null || currentRegistration === undefined) {
      this.props.history.push('/worker/search');
    }
  }

  render() {
    const { machineState, transition, t } = this.props;
    const registration = machineState.currentRegistration;

    if (!registration) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="margin-bottom-4">
          <UI.Header
            border
            text={getFullName(getApplicant(registration.client.household))}
          >
            <div>
              <p>{ t('worker.search.id.label') }:</p>
              <b>{ registration.client.id }</b>
            </div>
          </UI.Header>
        </div>
        <EligibilityDisplay eligibility={machineState.eligibility} />
        <SnapshotReview
          values={registration.client}
          onNext={transition}
          onQuit={() => transition({ command: 'QUIT' })}
        />
      </React.Fragment>
    )
  }
}

export default withRouter(withLocale(WorkerReview));
