import React from 'react';
import withLocale from 'components/with-locale';
import Button from 'components/button';
import SnapshotReview from 'components/snapshot-review';

class ApplicantReview extends React.Component {
  render() {
    const { state, transition, t } = this.props;

    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }
}

export default withLocale(ApplicantReview);
