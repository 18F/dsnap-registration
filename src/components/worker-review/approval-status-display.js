import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import UI from 'components/ui';

const defaultClassName = 'grid-col padding-y-2 padding-x-4 text-white margin-bottom-4';

class ApprovalStatusDisplay extends React.Component {
  static propTypes = {
    approved: PropTypes.bool,
    approvedBy: PropTypes.string,
    approvedAt: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.scrollRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (
      typeof this.props.approved === 'boolean' &&
      typeof prevProps.approved !== 'boolean'
    ) {
      window.scrollTo(0, this.scrollRef.current.offsetTop);
    }
  }

  render() {
    const { approved, approvedAt, approvedBy } = this.props;
    const computedClassName = classnames(defaultClassName, {
      'bg-secondary': !approved,
      'bg-mint': approved
    });

    if (typeof approved !== 'boolean') {
      return null;
    }

    return (
      <div className={computedClassName} ref={this.scrollRef}>
        <UI.Header type="h2">
          { approved ? 'Approved' : 'Denied' }
        </UI.Header>
        <p>
          Date: { moment(approvedAt).format("dddd, MMMM Do YYYY, h:mm:ss a") }
        </p>
        <p>By: { approvedBy } </p>
      </div>
    );
  }
}

export default ApprovalStatusDisplay;
