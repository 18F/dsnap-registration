import React from 'react';
import { Form, Formik } from 'formik';
import { withRouter } from 'react-router-dom';
import { helpers } from 'locales';
import withLocale from 'components/with-locale';
import preregistration from 'models/preregistration';
import preregistrationValidator from 'validators/preregistration';
import Dropdown from 'components/dropdown';
import Button from 'components/button';

const languageOptions = [{
  text: 'English',
  value: 'en'
}, {
  text: 'Spanish',
  value: 'sp'
}];

class PreregistrationSection extends React.Component {
  handleSubmit = () => {
    this.props.history.push('/form/pre-registration');
  }

  render() {
    const { t, name } = this.props;

    return (
      <section>
        <div className="usa-header margin-0">
          <div className="bg-primary padding-2">
            <div className="grid-container">
              <div className="text-white margin-x-3 margin-y-3 padding-bottom-3">
                <h1>
                  { t(`${name}.header`) }
                </h1>
                <p className="font-serif-md">
                  { t(`${name}.byline`) }
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid-container">
          <section className="margin-x-5">
            <h2>{ t(`${name}.conditions.header`) }</h2>
            { helpers.renderListT({ name: `${name}.conditions.body` }) }
          </section>
          <Formik
            initialValues={{ preregistration }}
            onSubmit={this.handleSubmit}
            validate={preregistrationValidator}
            render={({ handleSubmit }) => {
              return (
                <Form className="grid-container margin-x-0" onSubmit={handleSubmit}>
                  <Dropdown
                    labelText={t(`${name}.language.header`)}
                    name={`${name}.language`}
                    options={languageOptions}
                  />
                  <div className="margin-y-2">
                    <Button>
                      {t(`${name}.language.action`)}
                    </Button>
                  </div>
                </Form>
              );
            }}
          />
        </div>
      </section>
    );
  }
}

export default withRouter(withLocale(PreregistrationSection));
