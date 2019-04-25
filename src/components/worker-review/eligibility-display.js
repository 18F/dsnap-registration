import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Collapsible from 'components/collapsible';

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
        name="eligibility-info"
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

export default EligibilityDisplay;
