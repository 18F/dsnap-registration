import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import withLocale from 'components/with-locale';
import Button from 'components/button';

const SCROLL_OFFSET_PADDING = 40;

class ReviewSubSection extends React.Component {
  static propTypes = {
    onEdit: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]).isRequired
  }

  static defaultProps = {
    onEdit: () => {
      console.log('Default onEdit handler called in review subsection. Do you forget to pass an update handler?')
    },
    onUpdate: () => {
      console.log('Default onUpdate handler called in review subsection. Do you forget to pass an update handler?')
    }
  }

  state = {
    editing: false,
  }

  ref = React.createRef()

  isEditMode() {
    return this.state.editing;
  }

  isReadonly() {
    return this.props.readonly;
  }

  handleToggleEdit = () => {
    this.setState(state => ({ ...state, editing: !this.state.editing }), () => {
      this.props.onEdit(this.state.editing);
    });
  }

  handleUpdate = () => {
    const updated = this.props.onUpdate();
    const scrollY = Math.abs(this.ref.current.offsetTop) - SCROLL_OFFSET_PADDING;

    if (updated) {
      this.setState({ editing: false });
      window.scrollTo(0, scrollY > 0 ? scrollY : 0);
    }
  }

  renderTitle() {
    return ( 
      <h2
        className="margin-0 grid-col-fill text-bottom display-inline-block"
        style={{ alignSelf: 'flex-end' }}
      >
        { this.props.title }
      </h2>
    );
  }

  renderEditAction() {
    if (this.isEditMode() || this.isReadonly()) {
      return null;
    }

    return (
      <Button
        type="button"
        className="margin-right-0"
        onClick={this.handleToggleEdit}
      >
        { this.props.t('review.edit.inactive') }
      </Button>
    )
  }

  renderHeader() {
    return (
      <div className="border-bottom-1px border-base-lighter margin-bottom-2" ref={this.ref}>
        <div className="grid-row margin-bottom-05">
          { this.renderTitle() }
          { this.renderEditAction() }
        </div>
      </div>
    )
  }

  renderUpdateAction() {
    if (!this.isEditMode() || this.isReadonly()) {
      return null;
    }

    return (
      <Button
        type="button"
        onClick={this.handleUpdate}
      >
        { this.props.t('review.update') }
      </Button>
    );
  }

  render() {
    const { title } = this.props;
    const editClassName = classnames({
      'bg-primary-lighter padding-2': this.isEditMode()
    });

    return (
      <div id={`review-subsection-${title}`} className="margin-top-2 margin-bottom-6">
        { this.renderHeader() }
        <div className={editClassName}>
          { this.props.children({ editing: this.isEditMode() }) }
          { this.renderUpdateAction() }
        </div>
      </div>
    );
  }
}

export default withLocale(ReviewSubSection);
