import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { helpers } from 'locales'; 
import LocaleContext from 'locale-context';
import UI from 'components/ui';
import Collapsible from 'components/collapsible';
import Button from 'components/button';
import LockIcon from 'components/icons/lock';

class BasicInfoIntro extends React.Component {
  static propTypes = {
    tKey: PropTypes.string,
  }

  handleClick = () => {
    this.props.history.push('/form/basic-info/applicant-name');
  }

  render() {
    const { tKey } = this.props;

    return (
      <LocaleContext.Consumer>
        {(t) => {
          return (
            <section className="grid-col-8">
              <UI.Header className="margin-bottom-4 font-sans-xl" type="h1" border>
                {t(`${tKey}.header`)}
              </UI.Header>
              <p className="margin-bottom-4">{t(`${tKey}.byline`)}</p>
              <b>{t(`${tKey}.conditions.header`)}</b>
              { helpers.renderListT({ name: `${tKey}.conditions.body` }) }
              <div className="margin-y-4">
                <Collapsible name="immigrants" header={t(`${tKey}.immigrants.header`)}>
                  <div>
                    <p>{t(`${tKey}.immigrants.apply`)}</p>
                    <p><b>{t(`${tKey}.immigrants.benefit`)}</b></p>
                    <p>{t(`${tKey}.immigrants.reassure`)}</p>
                  </div>
                </Collapsible>
              </div>

              <div className="bg-accent-warm-lighter width-100 padding-2">
                <div className="grid-container">
                  <div className="grid-row">
                    <div className="grid-col-1 margin-top-05">
                      <LockIcon />
                    </div>
                    <div className="grid-col-11 text-base">
                      <Trans i18nKey={`${tKey}.security.copy`}>
                        This information is kept confidential and secure as required by law. <a href="https://google.com">Learn more</a>
                      </Trans>
                    </div>
                  </div>
                </div>
              </div>

              <p className="margin-y-4">
                <em>{ t(`${tKey}.copy`) }</em>
              </p>
              <Button type="button" className="font-sans-md" onClick={this.handleClick}>
                { t(`${tKey}.action`) }
              </Button>
            </section>
          );
        }}
      </LocaleContext.Consumer>
    );
  }
}

export { BasicInfoIntro }
export default withRouter(BasicInfoIntro);
