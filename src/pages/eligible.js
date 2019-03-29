import React from 'react';
import withLocale from 'components/with-locale';

class EligiblePage extends React.Component {
  render() {
    const { t } = this.props;
 
    return (
      <div>
        <div className="border-bottom-1px border-base-lighter margin-bottom-2">
          <h1 className="font-sans-2xl">
            { t(`${this.props.type}.header`)}
          </h1>
        </div>
        <p className="font-sans-lg">
          { t(`${this.props.type}.lede`)}
        </p>
      </div>
    );
  }
}

export default withLocale(EligiblePage);
