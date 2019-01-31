import React from 'react';
import { Form, Formik } from 'formik';
import { withRouter } from 'react-router-dom';
import withFormPage from './with-form-page';
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

const renderConditionals = ({ t, name }) =>
  <ul>
    {
      t(`${name}.conditions.body`, { returnObjects: true })
        .map((text, index) => {
          return (
            <li
              className="margin-y-1"
              key={`${name}.conditions.${index}`}
            >
              { t(text) }
            </li>
          );
        })
    }
  </ul>

class PreregistrationSection extends React.Component {
  handleSubmit = () => {
    this.props.history.push('/form/basic-info');
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
            { renderConditionals({ t, name }) }
          </section>
          <Formik
            initialValues={{ preregistration }}
            onSubmit={this.handleSubmit}
            validate={preregistrationValidator}
            render={({ handleSubmit }) => {
              return (
                <div className="grid-container margin-x-0">
                  <Form onSubmit={handleSubmit}>
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
                </div>
              );
            }}
          />
        </div>
      </section>
    );
  }
}

export default withRouter(withFormPage(PreregistrationSection));
