import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  checked: PropTypes.bool,
  explanation: PropTypes.bool,
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['radio', 'checkbox']).isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired
};

const valueToBool = (value) => {
  switch(value) {
    case 'true': return true;
    case 'false': return false;
    default: return !!value;
  }
}

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
    const { type, value } = this.props;
    const boolValue = valueToBool(value);

    return (
      <div className="border radius-md border-base-light display-inline-block margin-right-2">
        <input
          ref={this.checkbox}
          className={`usa-${type}-input`}
          type={type}
          value={this.props.radioValue}
          name={this.props.name}
          checked={boolValue === this.props.radioValue}
          onChange={this.props.onChange}
          readOnly
        />
        <label
          className={`usa-${type}-label margin-left-5 margin-right-3 margin-y-2 font-size-md padding-x-1 font-sans-md border-base-lighter`}
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
