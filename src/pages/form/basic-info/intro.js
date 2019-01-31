import React from 'react';
import { connect } from 'react-redux';
import LocaleContext from 'locale-context';
import UI from 'components/ui';

class BasicInfoIntro extends React.Component {
  render() {
    return (
      <LocaleContext.Consumer>
        {(t) => {
          return (
            <section>
              <UI.Header type="h1">
                {t('basicInfo.intro.header')}
              </UI.Header>
              <p>{t('basicInfo.intro.byline')}</p>
              <p>
                <b>{t('basicInfo.intro.conditions.header')}</b>
              </p>
            </section>
          );
        }}
      </LocaleContext.Consumer>
    );
  }
}

export { BasicInfoIntro }
export default BasicInfoIntro;
