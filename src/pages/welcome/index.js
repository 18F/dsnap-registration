import React from 'react';
import { Form, Formik } from 'formik';
import { withRouter } from 'react-router-dom';
import { helpers } from 'locales';
import withLocale from 'components/with-locale';
import languageSchema from 'schemas/language';
import FormikField from 'components/formik-field';
import Button from 'components/button';
import i18n from 'i18n';
import { supportedLanguages } from 'utils';

class PreregistrationSection extends React.Component {
  handleSubmit = (values) => {
    this.props.onNext({ data: values });
  }

  handleChange = (event) => {
    const language = event.target.value;
    
    if (supportedLanguages.includes(language)) {
      i18n.changeLanguage(language);
    }
  }

  getLanguageOptions() {
    return [{
      text: this.props.t('general.language.options.en'),
      value: 'en'
    }, {
      text: this.props.t('general.language.options.es'),
      value: 'es'
    }]
  }

  render() {
    const { t } = this.props;

    return (
      <section>
        <div className="usa-header margin-0">
          <div className="bg-primary padding-2">
            <div className="grid-container">
              <div className="text-white margin-x-3 margin-y-3 padding-bottom-3">
                <h1>
                  { t('welcome.header') }
                </h1>
                <p className="font-serif-md">
                  { t('welcome.lede') }
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid-container">
          <section className="margin-x-5">
            <h2>{ t('welcome.conditions.header') }</h2>
            { helpers.renderListT({ name: 'welcome.conditions.body' }) }
          </section>
          <Formik
            initialValues={this.props.values}
            onSubmit={this.handleSubmit}
            validationSchema={languageSchema}
            render={({ handleSubmit, errors, isSubmitting }) => {
              const disabled = Object.keys(errors).length || isSubmitting;

              return (
                <Form className="grid-container margin-x-0" onSubmit={handleSubmit}>
                  <FormikField
                    type="select"
                    labelText={t('welcome.language.header')}
                    name="config.language"
                    options={this.getLanguageOptions()}
                    onChange={this.handleChange}
                  />
                  <div className="margin-y-2">
                    <Button disabled={disabled}>
                      {t('welcome.language.action')}
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
