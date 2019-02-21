import React from 'react';
import { FieldArray } from 'formik';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField from 'components/formik-field';
import { buildNestedKey } from 'utils';
import { getCustomerFirstName } from 'models/basic-info';
import { getMembers } from 'models/household';
import UI from 'components/ui';

const modelName = 'memberNames';

const MemberNames = ({ handleChange, sectionName, t, registerStep }) => (
  <Wizard.Context>
    {({ basicInfo, household }) => {
      const customerName = getCustomerFirstName(basicInfo);

      return (
        <Wizard.Step
          header={
            t(`${buildNestedKey(sectionName, modelName, 'header')}`, { customerName })
          }
          modelName={modelName}
          registerStep={registerStep}
        >
          <React.Fragment>
            <UI.Header
              type="h2"
              size="sm"
            >
              { t(`${sectionName}.${modelName}.byline`)}
            </UI.Header>
            <FieldArray
              name={`${sectionName}.members`}
              render={() => {
                return getMembers(household).map((_, index) =>
                  <div key={index} className="padding-bottom-4">
                    <h3>Person { index + 1 }</h3>
                    <FormikField
                      name={`${sectionName}.members.${index}.name.firstName`}
                      labelText={t(`${sectionName}.memberNames.firstName.label`)}
                      onChange={handleChange}
                      quietLabel
                    />
                    <FormikField
                      name={`${sectionName}.members.${index}.name.middleName`}
                      labelText={t(`${sectionName}.memberNames.middleName.label`)}
                      onChange={handleChange}
                      quietLabel
                    />
                    <FormikField
                      name={`${sectionName}.members.${index}.name.lastName`}
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
