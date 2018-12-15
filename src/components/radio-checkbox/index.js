import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  checked: PropTypes.bool,
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['radio', 'checkbox']).isRequired,
  value: PropTypes.string.isRequired
};

class RadioCheckbox extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.onChange(this.props.value);
  }

  render() {
    const { type } = this.props;

    return (
      <React.Fragment>
        <input
          className={`usa-${type}-input`}
          type={type}
          value={this.props.value}
          name={this.props.name}
          checked={this.props.checked}
          readOnly
        />
        <label
          className={`usa-${type}-label`}
          htmlFor={this.props.name}
          onClick={this.handleChange}
        >
          {this.props.labelText}
        </label>
      </React.Fragment>
    );
  }
}

// XXX This might not be necessary, since our reducers should theoretically be providing these values
RadioCheckbox.defaultProps = {
  checked: false
};
RadioCheckbox.propTypes = propTypes;

export default RadioCheckbox;
