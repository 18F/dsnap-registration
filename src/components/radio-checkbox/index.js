import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  checked: PropTypes.bool,
  explanation: PropTypes.bool,
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['radio', 'checkbox']).isRequired,
  value: PropTypes.string.isRequired
};

class RadioCheckbox extends React.Component {
  /**
   * This is a goofy pattern, but we have to use it
   * Formik wants the change/click event to point to the actual underlying field, but
   * in the case of radio buttons, the label is what sends the click event to formik.
   * rather than stub out a bunch event data that formik may or may not want now (or in the future!)
   * we make a ref to the check box, and have the label serve as a delegate for the
   * actual click event we want formik to receive
   **/
  checkbox = React.createRef()

  handleChange = () => {
    this.checkbox.current.click();
  }

  render() {
    const { type } = this.props;

    return (
      <div className="usa-form-group">
        <input
          ref={this.checkbox}
          className={`usa-${type}-input`}
          type={type}
          value={this.props.value}
          name={this.props.name}
          checked={this.props.value}
          onChange={this.props.onChange}
          readOnly
        />
        <label
          className={`usa-${type}-label`}
          htmlFor={this.props.name}
          onClick={this.handleChange}
        >
          {this.props.labelText}
        </label>
      </div>
    );
  }
}

// XXX This might not be necessary, since our reducers should theoretically be providing these values
RadioCheckbox.defaultProps = {
  checked: false
};
RadioCheckbox.propTypes = propTypes;

export default RadioCheckbox;
