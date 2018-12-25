import React from 'react';
import PropTypes from 'prop-types';
import Wizard from 'components/wizard';
import LocaleContext from 'locale-context';


const FormPage = (Component) => {
  return class extends React.Component {
    render() {
      return (
        <LocaleContext.Provider>
          {(t) => (
            <Component {...this.props} t={t} />
          )}
        </LocaleContext.Provider>
      );
    }
  }
};

export default FormPage;
