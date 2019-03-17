import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import withLocale from 'components/with-locale';
import Button from 'components/button';

const ReviewTableHeader = ({ title, children: actions, editing }) => (
  <div className="grid-row bg-base-lighter padding-2">
    <div className="grid-col-fill">
      <h3 className="margin-y-0">
        { title }
      </h3>
    </div>
    { editing ? actions : null }
  </div>
);

const ReviewTableHeaderAction = ({ text, onClick, ...rest }) => (
  <Button
    type="button"
    onClick={onClick}
    {...rest}
  >
    { text }  
  </Button>
);

const ReviewTableDatum = ({ datum }) =>
  datum ? <p className="margin-top-0">{ datum }</p> : null;

const ReviewTableDisplayRow = ({ name, data, stripe }) => (
  <div className={classnames('grid-col padding-2', { 'bg-base-lighter': stripe })}>
    <b>{ name }</b>
    <ReviewTableDatum datum={data} />
  </div>
);

class ReviewTable extends React.Component {
  static propTypes = {
    editing: PropTypes.bool,
    primaryData: PropTypes.array,
    secondaryData: PropTypes.array,
  }

  static defaultProps = {
    editing: false,
    primaryData: [],
    secondaryData: [],
  }

  state = {
    showDetails: false
  }

  showDetails() {
    return this.state.showDetails && this.props.secondaryData.length;
  }

  handleShowDetails = () => {
    this.setState({
      showDetails: !this.state.showDetails
    });
  }

  renderDetailsAction() {
    const { t, editing } = this.props;

    if (!this.props.secondaryData.length || editing) {
      return null;
    }

    const buttonActivityType = this.showDetails() ? 'active' : 'inactive';

    return (
      <Button
        type="button"
        onClick={this.handleShowDetails}
        link
      >
        { t(`review.details.${buttonActivityType}`) }
      </Button>
    )
  }

  renderEditableComponent({ component }) {
    if (Array.isArray(component)) {
      return (
        <React.Fragment>
          { component.map(({ Component, props}) => <Component {...props} />) }
        </React.Fragment>
      );
    }
    
    return <component.Component {...component.props} />;
  }

  renderDatumRow(datum, index) {
    return (
      <div index={index}>
        {
          this.props.editing ?
            this.renderEditableComponent(datum) :
            <ReviewTableDisplayRow {...datum} stripe={index % 2} />
        }
      </div>
    );
  }

  renderSecondaryData() {
    const { editing, secondaryData } = this.props;

    if (!secondaryData.length) {
      return null;
    }

    const rows = secondaryData.reduce((memo, datum, index) => {
      if (editing && datum.readonly) {
        return memo;
      }

      return [
        ...memo,
        this.renderDatumRow(datum, index)
      ]
    }, []);

    return (
      <React.Fragment>
        { this.showDetails() || editing ? rows : null }
        { this.renderDetailsAction() }
      </React.Fragment>
    )
  }

  render() {
    const { children, editing, primaryData } = this.props;
    const className = classnames('margin-bottom-2', {
      'border-1px border-base-lighter': !editing
    });

    return (
      <div className={className}>
        { children }
        {
          primaryData.reduce((memo, datum, index) => {
            if ((editing || this.showDetails()) && datum.readonly) {
              return memo;
            }

            return [
              ...memo,
              this.renderDatumRow(datum, index)
            ]
          }, [])
        }
        { this.renderSecondaryData() }
      </div>
    );
  }
}

export { ReviewTableHeader as Header, ReviewTableHeaderAction as HeaderAction };
export default withLocale(ReviewTable);
