import React from 'react';
import withLocale from 'components/with-locale';
import SnapshotReview from 'components/snapshot-review';

class WorkerReview extends React.Component {
  render() {
    const registration = this.props.machineState.registrations[
      this.props.machineState.currentRegistration
    ];
    console.log(registration)
    return (
      <h1>review me</h1>
    )
  }
}

export default withLocale(WorkerReview);
