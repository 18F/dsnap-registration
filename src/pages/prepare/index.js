import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { helpers } from 'locales';
import withLocale from 'components/with-locale';
import UI from 'components/ui';
import Button from 'components/button';
import SecurityAlert from 'components/security-alert';

class PreparePage extends React.Component {
  static propTypes = {
    preparation: PropTypes.string,
  }

  handleClick = () => {
    this.props.onNext({ command: 'NEXT' });
  }

  render() {
    const { t } = this.props;

    return (   
      <section>
        <UI.Header className="margin-bottom-4 font-sans-xl" type="h1" border>
          {t('preparation.header')}
        </UI.Header>
        <div className="margin-top-4 margin-bottom-2">
          <b>{t('preparation.conditions.header')}</b>
        </div>
        { helpers.renderListT({ name: 'preparation.conditions.body' }) }
        <SecurityAlert />
        <p className="margin-y-4">
          <em>{ t('preparation.copy') }</em>
        </p>
        <Button type="button" className="font-sans-md" onClick={this.handleClick}>
          { t('preparation.action') }
        </Button>
      </section>
    );
  }
}

export { PreparePage }
export default withRouter(withLocale(PreparePage));
