import React from 'react';
import { withRouter } from 'react-router-dom';
import Header from 'components/header';
import ScrollToTop from 'components/scroll-to-top';
import LocaleContext from './locale-context';

class App extends React.Component {
  render() {
    const { t, location } = this.props;
    const className = location.pathname.indexOf('worker') !== -1 ?
      'bg-secondary-darker' : 'bg-primary-darker';

    return (
      <LocaleContext.Provider value={ t }>
        <section className="usa-banner site-banner bg-yellow">
          <div className="usa-accordion">
            <header className="usa-banner-header">
              <div className="margin-x-5">
                <div className="font-sans-md">
                  <b>Demonstration website only.</b> No D-SNAP benefits will be issued. Do not enter private or personal data. <a className="cursor-pointer" href="https://github.com/18F/eligibility-rules-service/blob/master/dsnap.md">Read more</a>
                </div>
              </div>
            </header>
          </div>
        </section>
        <Header text={t('general.header')} className={className} />
        <ScrollToTop>
          <main>
            { this.props.children }
          </main>
        </ScrollToTop>
      </LocaleContext.Provider>
    );
  }
}

export { App }
export default withRouter(App);
