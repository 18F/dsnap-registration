import React from 'react';
import { withRouter } from 'react-router-dom';
import withLocale from 'components/with-locale';
import UI from 'components/ui';
import SnapshotReview from 'components/snapshot-review';
import { getApplicant } from 'models/household';
import { getFullName } from 'models/person';

class WorkerReview extends React.Component {
  componentDidMount() {
    const { machineState: { currentRegistration } } = this.props;

    if (currentRegistration === null || currentRegistration === undefined) {
      this.props.history.push('/worker/search');
    }
  }

  render() {
    const { machineState, transition, t } = this.props;
    const registration = machineState.registrations[
      machineState.currentRegistration
    ];

    if (!registration) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="margin-bottom-4">
          <UI.Header
            border
            text={getFullName(getApplicant(registration.household))}
          >
            <div>
              <p>{ t('worker.search.id.label') }:</p>
              <b>{ registration.id }</b>
            </div>
          </UI.Header>
        </div>
        <SnapshotReview
          values={registration}
          onNext={transition}
          onQuit={() => transition({ command: 'QUIT' })}
        />
      </React.Fragment>
    )
  }
}

export default withRouter(withLocale(WorkerReview));
