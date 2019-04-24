import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import withUpdateable from 'components/with-updateable';
import withLocale from 'components/with-locale';
import UI from 'components/ui';
import SnapshotReview from 'components/snapshot-review';
import FormikField from 'components/formik-field';
import Button from 'components/button';
import Collapsible from 'components/collapsible';
import { getApplicant } from 'models/household';
import { getFullName } from 'models/person';
import moment from 'moment';
import './styles.scss';

class ApprovalStatusDisplay extends React.Component {
  static propTypes = {
    approved: PropTypes.bool,
    approvedBy: PropTypes.string,
    approvedAt: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.scrollRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (
      typeof this.props.approved === 'boolean' &&
      typeof prevProps.approved !== 'boolean'
    ) {
      window.scrollTo(0, this.scrollRef.current.offsetTop);
    }
  }

  render() {
    const { approved, approvedAt, approvedBy } = this.props;
    const computedClassName = classnames('grid-col padding-y-2 padding-x-4 text-white margin-bottom-4', {
      'bg-secondary': !approved,
      'bg-mint': approved
    });

    if (typeof approved !== 'boolean') {
      return null;
    }

    return (
      <div className={computedClassName} ref={this.scrollRef}>
        <UI.Header type="h2">
          { approved ? 'Approved' : 'Denied' }
        </UI.Header>
        <p>Date: {moment(approvedAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}</p>
        <p>By: {approvedBy} </p>
      </div>
    );
  }
}

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
    }).isRequired,
    isOpen: PropTypes.bool
  }

  eligibleClassName(eligible) {
    return classnames('margin-top-2', {
      'text-green': eligible,
      'text-red': !eligible
    });
  }

  render() {
    const { eligibility } = this.props;
    const eligibleClassName = this.eligibleClassName(eligibility.eligible);

    return (
      <Collapsible
        collapsed={this.props.isOpen}
        header="Eligibility Info"
        gridClassName="grid-col"
        buttonClassName="bg-accent-warm-lighter hover:bg-accent-warm-lighter text-black"
        contentClassName="bg-accent-warm-lighter"
      >
        <section className="grid-col padding-4 bg-accent-warm-lighter text-black margin-bottom-4">
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
          <p className="font-sans-md margin-top-4 margin-bottom-1">
            <b>Allotment</b>
          </p>
          <span>
            ${eligibility.metrics.allotment || 0}
          </span>
        </section>
      </Collapsible>
    );
  }
}

class EBTSection extends React.Component {
  static propTypes = {
    formik: PropTypes.shape({
      values: PropTypes.object
    }),
    t: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
  }

  render() {
    return (
      <section className="margin-bottom-4">
        <div className="border-bottom-1px border-base-lighter margin-bottom-2">
          <div className="grid-row margin-bottom-05">
            <h2
              className="margin-0 grid-col-fill text-bottom display-inline-block"
              style={{ alignSelf: 'flex-end' }}
            >
              { this.props.title }
            </h2>
          </div>
        </div>
        <FormikField
          labelText={this.props.t('worker.review.ebt.label')}
          name="basicInfo.ebtCardNumber"
          onBlur={this.props.handleUpdate}
        />
      </section>
    );
  }
}

const EBTReviewSection = withUpdateable(withLocale(EBTSection));

class WorkerReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      readonly: false
    };
    this.scrollRef = React.createRef();
  }

  componentDidMount() {
    const { machineState: { currentRegistration } } = this.props;

    if (currentRegistration === null || currentRegistration === undefined) {
      this.props.history.push('/worker/search');
    }
  }

  handleUpdate = (values) => {
    console.log(this.props)
  }

  handleApprove = () => {
    this.setState({ readonly: true });
    this.props.transition({ command: 'APPROVE' });
  }

  handleDeny = () => {
    this.setState({ readonly: true });
    this.props.transition({ command: 'DENY' });
  }

  render() {
    const { machineState, t } = this.props;
    const registration = machineState.currentRegistration;
    const { client } = registration;

    if (!registration) {
      return null;
    }

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
          isOpen={typeof client.approved === 'boolean'}
        />
        <SnapshotReview
          readonly={this.state.readonly}
          values={{ disasters: machineState.disasters, ...client }}
          onNext={this.handleUpdate}
          sections={[<EBTReviewSection title={t('worker.review.ebt.header')} />]}
          render={(formik) => {
            return (
              typeof client.approved === 'boolean' ?
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

export default withRouter(withLocale(WorkerReview));
