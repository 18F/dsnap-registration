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

const ReviewTableRow = ({ children, stripe }) => (
  <div className="grid-row margin-y-2">
    <div className={classnames('grid-col padding-2', { 'bg-base-lighter': stripe })}>
      { children }
    </div>
  </div>
);

const ReviewTableDisplayRow = ({ name, data, stripe }) => (
  <ReviewTableRow stripe={stripe}>
    <b>{ name }:</b>
    <p>{ data }</p>
  </ReviewTableRow>
);

const ReviewTable = ({ rows, editable }) => (
  <React.Fragment>
    { 
      rows.map((row, index) => {
        const { Component } = row;
        const key = `${row.name}.${index}`;

        if (editable && Component) {
          return (
            <ReviewTableRow key={key}>
              <Component />
            </ReviewTableRow>
          );
        }

        return <ReviewTableDisplayRow {...row} stripe={index % 2 === 0} key={key} />
      })
    }
  </React.Fragment>
);

class Review extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      data: PropTypes.any,
      Component: PropTypes.func,
    })),
    details: PropTypes.bool
  }

  static defaultProps = {
    details: false,
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
        <ReviewTable rows={this.props.data} editable={this.state.editing} />
        { this.props.details ?
            <ToggleButton
              activeText={t('review.details.active')}
              inactiveText={t('review.details.inactive')}
              isActive={this.state.showDetails}
              className="padding-0"
              onClick={this.handleShowDetails}
              link
            /> : null
        }
      </React.Fragment>
    );
  }
}

export default withLocale(Review);
