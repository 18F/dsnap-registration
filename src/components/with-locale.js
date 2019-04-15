import React from 'react';
import LocaleContext from 'locale-context';

const withLocale = (Component) =>
  class extends React.Component {
    WrappedComponent = Component

    render() {
      return (
        <LocaleContext.Consumer>
          {(t) => (
            <Component {...this.props} t={t} />
          )}
        </LocaleContext.Consumer>
      );
    }
  }

export default withLocale;
