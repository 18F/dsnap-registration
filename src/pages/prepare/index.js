import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { helpers } from 'locales';
import withLocale from 'components/with-locale';
import UI from 'components/ui';
import Collapsible from 'components/collapsible';
import Button from 'components/button';
import SecurityAlert from 'components/security-alert';

const tKey = 'preparation';

class PreparePage extends React.Component {
  static propTypes = {
    tKey: PropTypes.string,
  }

  handleClick = () => {
    this.props.onNext({ command: 'NEXT' });
  }

  render() {
    const { t } = this.props;

    return (   
      <section>
        <UI.Header className="margin-bottom-4 font-sans-xl" type="h1" border>
          {t(`${tKey}.header`)}
        </UI.Header>
        <p className="margin-bottom-4">{t(`${tKey}.lede`)}</p>
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
        <SecurityAlert />
        <p className="margin-y-4">
          <em>{ t(`${tKey}.copy`) }</em>
        </p>
        <Button type="button" className="font-sans-md" onClick={this.handleClick}>
          { t(`${tKey}.action`) }
        </Button>
      </section>
    );
  }
}

export { PreparePage }
export default withRouter(withLocale(PreparePage));
