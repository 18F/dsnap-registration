import React from 'react';
import PropTypes from 'prop-types';
import withLocale from 'components/with-locale';
import UI from 'components/ui';
import SnapshotReview from 'components/snapshot-review';
import ApprovalStatusDisplay from 'components/worker-review/approval-status-display';
import EligibilityDisplay from 'components/worker-review/eligibility-display';
import EBTReviewSection from 'components/review/ebt';
import Button from 'components/button';
import { getApplicant } from 'models/household';
import { getFullName } from 'models/person';
import './styles.scss';

class WorkerReview extends React.Component {
  static propTypes = {
    machineState: PropTypes.shape({
      currentRegistration: PropTypes.shape({
        client: PropTypes.object,
        server: PropTypes.object
      }),
      disasters: PropTypes.object
    }),
    t: PropTypes.func.isRequired,
    transition: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { machineState } = this.props;
    const { currentRegistration } = machineState;

    if (currentRegistration === null || currentRegistration === undefined) {
      this.props.transition({ command: 'worker.search' });
    } else {
      this.props.transition({ command: 'SEARCH', data: {
        id: currentRegistration.client.id
      }});
    }
  }

  handleApprove = () => {
    this.props.transition({ command: 'APPROVE' });
  }

  handleDeny = () => {
    this.props.transition({ command: 'DENY' });
  }

  hasApprovalStatus() {
    const { machineState } = this.props;
    const registration = machineState.currentRegistration;
    const { client: { approved } } = registration;

    return typeof approved === 'boolean';
  }

  render() {
    const { machineState, t } = this.props;
    const registration = machineState.currentRegistration;

    if (!registration) {
      return null;
    }

    const { client } = registration;

    return (
      <React.Fragment>
        <div className="margin-bottom-4">
          <UI.Header
            border
            text={getFullName(getApplicant(client.household))}
          >
            <div>
              <p>{ t('worker.search.id.label') }:</p>
              <b>{ client.id }</b>
            </div>
          </UI.Header>
        </div>
        <ApprovalStatusDisplay
          approved={client.approved}
          approvedAt={client.approvedAt}
          approvedBy={client.approvedBy}
        />
        <EligibilityDisplay
          eligibility={machineState.eligibility}
          isOpen={this.hasApprovalStatus()}
        />
        <SnapshotReview
          readonly={this.hasApprovalStatus()}
          values={{ disasters: machineState.disasters, ...client }}
          sections={[<EBTReviewSection title={t('worker.review.ebt.header')} />]}
          render={(formik) => {
            return (
              this.hasApprovalStatus() ?
              null :
              <div>
                <Button
                  className="worker-approve bg-mint"
                  disabled={formik.isSubmitting}
                  onClick={this.handleApprove}
                >
                  Approve
                </Button>
                <Button
                  className="worker-deny bg-red"
                  disabled={formik.isSubmitting}
                  onClick={this.handleDeny}
                >
                  Deny
                </Button>
              </div>
            );
          }}
        />
      </React.Fragment>
    )
  }
}

export default withLocale(WorkerReview);
