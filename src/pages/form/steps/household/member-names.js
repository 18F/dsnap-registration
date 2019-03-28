import React from 'react';
import { FieldArray } from 'formik';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField from 'components/formik-field';
import { buildNestedKey } from 'utils';
import { getFirstName } from 'models/person';
import { getMembers, getApplicant } from 'models/household';
import UI from 'components/ui';
import nameSchema from 'schemas/name';

const modelName = 'memberNames';

const MemberNames = ({ handleChange, sectionName, t, registerStep }) => (
  <Wizard.Context>
    {({ household }) => {
      const customerName = getFirstName(getApplicant(household));

      return (
        <Wizard.Step
          header={
            t(`${buildNestedKey(sectionName, modelName, 'header')}`, { customerName })
          }
          modelName={modelName}
          registerStep={registerStep}
          validationSchema={nameSchema}
        >
          <React.Fragment>
            <UI.Header type="h2" size="sm">
              { t(`${sectionName}.${modelName}.byline`)}
            </UI.Header>
            <FieldArray
              name={`${sectionName}.members`}
              render={() => {
                return getMembers(household).slice(1).map((_, index) =>
                  <div key={index} className="padding-bottom-4">
                    <h3>Person { index + 1 }</h3>
                    <FormikField
                      name={`${sectionName}.members.${index + 1}.name.firstName`}
                      labelText={t(`${sectionName}.memberNames.firstName.label`)}
                      onChange={handleChange}
                      quietLabel
                    />
                    <FormikField
                      name={`${sectionName}.members.${index + 1}.name.middleName`}
                      labelText={t(`${sectionName}.memberNames.middleName.label`)}
                      onChange={handleChange}
                      quietLabel
                    />
                    <FormikField
                      name={`${sectionName}.members.${index + 1}.name.lastName`}
                      labelText={t(`${sectionName}.memberNames.lastName.label`)}
                      onChange={handleChange}
                      quietLabel
                    />
                  </div>
                );
              }}
            />
          </React.Fragment>
        </Wizard.Step>
      );
    }}
  </Wizard.Context>
);

export default withLocale(MemberNames);
