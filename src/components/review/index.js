import React from 'react';
import { withRouter } from 'react-router-dom';
import { withMachineContext } from 'components/fsm';
import withLocale from 'components/with-locale';
import Button from 'components/button';
import SnapshotReview from 'components/snapshot-review';

class ApplicantReview extends React.Component {
  unlisten = null

  componentDidMount() {
    this.unlisten = this.props.history.listen((event, action) => {
      return setTimeout(() => {
        return this.rewindMemberIndex(event, action);
      }, 0);
    });
  }

  componentWillUnmount() {
    setTimeout(() => this.unlisten(), 0);
  }

  rewindMemberIndex = (_, action) => {
    if (action === 'POP') {
      this.props.fsmTransition({
        command: 'RESET_CURRENT_RESOURCE_MEMBER_INDEX',
      });
    }
  }

  render() {
    const { state, transition, t } = this.props;

    return (
      <SnapshotReview
        values={state}
        onNext={transition}
        render={({ submitCount, errors, values, isSubmitting, resetForm }) => {
          const disable = submitCount && (
            Object.keys(errors).length ||
            isSubmitting ||
            (values.errors && values.errors.server)
          );

          return (
            <div className="margin-y-2">
              <Button disabled={disable}>
                { t('review.next') }
              </Button>
              <Button
                type="button"
                onClick={() => {
                  resetForm();
                  transition({ command: 'QUIT' })
                }}
                link
              >
                { t('general.quit') }
              </Button>
            </div>
          );
        }}
      />
    );
  }
}

export default withMachineContext(withRouter(withLocale(ApplicantReview)));
