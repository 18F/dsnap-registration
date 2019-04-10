import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import withLocale from 'components/with-locale';
import AppContainer from 'components/app-container';
import UI from 'components/ui';
import FormikField, { FormikFieldDateGroup } from 'components/formik-field';
import Button from 'components/button';
import { getFullName, getDOB, getSSN } from 'models/person';
import { getApplicant } from 'models/household';

const searchFields = {
  state_id: '',
  registrant_ssn: '',
  registrant_dob: {
    month: '',
    day: '',
    year: ''
  },
  registrant_last_name: ''
};

class WorkerSearchResult extends React.Component {
  static propTypes = {
    applicant: PropTypes.object.isRequired,
    onSelectRegistration: PropTypes.func.isRequired,
    registrationIndex: PropTypes.number.isRequired
  }

  handleSelect = () => {
    this.props.onSelectRegistration(this.props.registrationIndex);
  }

  render() {
    const { applicant } = this.props;

    return (
      <tr>
        <th scope="row">
          { getFullName(applicant) }    
        </th>
        <td>
          { getDOB(applicant) }
        </td>
        <td>
          { getSSN(applicant) }
        </td>
        <td>
          <Button type="button" onClick={this.handleSelect}>
            Edit information
          </Button>
        </td>
      </tr>
    );
  }
}

class WorkerSearchResults extends React.Component {
  static defaultProps = {
    registrations:  []
  }

  renderRegistrationTable() {
    const { registrations } = this.props;

    return (
      <table className="usa-table usa-table-borderless">
        <caption>
          Registration applicant search results
        </caption>
        <thead>
          <tr>
            <th scope="col">Applicant Name</th>
            <th scope="col">Applicant DOB</th>
            <th scope="col">Applicant SSN</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {
            registrations.map((registration, index) => {
              const applicant = getApplicant(registration.household);

              return (
                <WorkerSearchResult
                  applicant={applicant}
                  registrationIndex={index}
                  key={index}
                  onSelectRegistration={this.props.onSelectRegistration}
                />
              );
            })
          }
        </tbody>
      </table>
    );
  }
 
  render() {
    const { t, registrations } = this.props;

    return (
      <section className="grid-col grid-col-6 margin-bottom-4 margin-top-6">
        <UI.Header border type="h3">
          { `${registrations.length} ${t('worker.search.results')}` }
        </UI.Header>
        {
          !registrations.length ?
          null :
          this.renderRegistrationTable()
        }
      </section>
    )
  }
}

const LocalizedSearchResults = withLocale(WorkerSearchResults);

class WorkerSearch extends React.Component {
  handleSearch = (values) => {
    this.props.transition({ command: 'SEARCH', data: { ...values } });
  }

  handleEdit = (registrationId) => {
    this.props.transition({ command: 'SELECT_REGISTRATION', data: {
      registrationId
    }});
  };

  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
        <UI.Header border size="lg">
          { t('worker.search.header') }
        </UI.Header>
        <Formik
          onSubmit={this.handleSearch}
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={searchFields}
          render={(formik) => {
            const disabled = !formik.dirty || !formik.isValid || formik.isSubmitting;

            return (
              <Form>
                <fieldset className="margin-bottom-4">
                  <FormikField
                    type="mask"
                    pattern="XXX-XX-XXXX"
                    delimiter="-"
                    labelText={t('worker.search.ssn.label')}
                    name='registrant_ssn'
                    onChange={(name, data) => formik.handleChange(name)(data)}
                  />
                  <FormikField
                    labelText={t('worker.search.stateId.label')}
                    name='state_id'
                  />
                  <FormikFieldDateGroup
                    inline
                    showError={false}
                    labelText={t('worker.search.dob.label')}
                    name='registrant_dob'
                    fields={[{
                      name: 'registrant_dob.month',
                      labelText: t('identity.personalInfo.dob.month')
                    }, {
                      name: 'registrant_dob.day',
                      labelText: t('identity.personalInfo.dob.day')
                    }, {
                      name: 'registrant_dob.year',
                      labelText: t('identity.personalInfo.dob.year')
                    }]}
                  />
                  <FormikField
                    labelText={t('worker.search.lastName.label')}
                    name='registrant_last_name'
                  />
                </fieldset>
                <Button disabled={false}>
                  { t('worker.search.action') }
                </Button>
              </Form>
            );
          }}
        />
        <LocalizedSearchResults
          registrations={this.props.machineState.registrations}
          onSelectRegistration={this.handleEdit}
        />
      </React.Fragment>
    );
  }
}

export default withLocale(WorkerSearch);
