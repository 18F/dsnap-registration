
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import withLocale from 'components/with-locale';
import Button from 'components/button';

const ToggleButton = ({ activeText, inactiveText, isActive, ...rest }) => (
  <Button 
    type="button"
    {...rest}
  >
    { isActive ? activeText : inactiveText }
  </Button>
);

const ReviewHeader = ({ children }) => (
  <h3
    className="margin-0 grid-col-fill text-bottom display-inline-block"
    style={{ alignSelf: 'flex-end' }}
  >
    { children }
  </h3>
);

const ReviewTableRow = ({ name, data, stripe }) => (
  <div className="grid-row margin-y-2">
    <div className={classnames('grid-col padding-2', { 'bg-base-lighter': stripe })}>
      <b>{ name }:</b>
      <p>{ data }</p>
    </div>
  </div>
);

const ReviewTable = ({ rows }) => (
  <div>
    { rows.map((row, index) => <ReviewTableRow {...row} stripe={index % 2 === 0} />) }
  </div>
);

class Review extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  }

  state = {
    editing: false,
    showDetails: false,
  }

  handleToggleEdit = () => {
    this.setState(state => ({ ...state, editing: !state.editing }));
  }

  handleShowDetails = () => {
    this.setState(state => ({ ...state, showDetails: !state.showDetails }));
  }

  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
        <div className="border-bottom-1px border-base-lighter">
          <div className="grid-row margin-bottom-05">
            <ReviewHeader>
              { t(`review.sections.${this.props.name}`) }
            </ReviewHeader>
            <ToggleButton
              activeText={t('review.edit.active')}
              inactiveText={t('review.edit.inactive')}
              isActive={this.state.editing}
              onClick={this.handleToggleEdit}
              className="margin-right-0"
            />
          </div>
        </div>
        <ReviewTable
          rows={[
            { name: 'Name', data: 'hey' },
            { name: 'Other', data: 'wheee' }
          ]}
        />
        <ToggleButton
          activeText={t('review.details.active')}
          inactiveText={t('review.details.inactive')}
          isActive={this.state.showDetails}
          className="padding-0"
          onClick={this.handleShowDetails}
          link
        />
      </React.Fragment>
    );
  }
}

export default withLocale(Review);
