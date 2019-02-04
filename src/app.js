import React from 'react';
import { withRouter } from 'react-router-dom';
import Header from 'components/header';
import ScrollToTop from 'components/scroll-to-top';
import LocaleContext from './locale-context';

class App extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <LocaleContext.Provider value={ t }>
        <Header text={t('general.header')} />
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
