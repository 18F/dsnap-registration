/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const propTypes = {
  checked: PropTypes.bool,
  explanation: PropTypes.string,
  groupClassName: PropTypes.string,
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['radio', 'checkbox']).isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

class RadioCheckbox extends React.Component {
  static propTypes = propTypes
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
    this.props.onInput();
    this.checkbox.current.click();
  }

  normalizeValue(value = this.props.value) {
    switch(value) {
      case 'true': return true;
      case 'false': return false;
      default: return value;
    }
  };
  
  isRadio() {
    return this.props.type === 'radio';
  }
  
  isChecked() {
    if (this.isRadio()) {
      return this.normalizeValue(this.props.value) === this.normalizeValue(this.props.radioValue);
    }

    return this.normalizeValue();
  }
  
  formGroupClassName() {
    return classnames(this.props.groupClassName);
  }

  render() {
    const { type } = this.props;

    return (
      <div
        className={this.formGroupClassName()}
        onClick={this.handleChange}
      >
        <input
          id={this.props.id}
          ref={this.checkbox}
          className={`usa-${type}-input`}
          type={type}
          value={this.props.radioValue}
          name={this.props.name}
          checked={this.isChecked()}
          onChange={this.props.onChange}
          onBlur={this.props.onBlur}
          readOnly
        />
        <label
          className={`usa-${type}-label padding-left-6 padding-right-3 padding-y-2 margin-bottom-0 font-sans-md`}
          htmlFor={this.props.name}
        >
          {this.props.labelText}
          <br />
          {
            this.props.explanation ?
            <span className="text-base">
              {this.props.explanation}
            </span> : null
          }
        </label>
      </div>
    );
  }
}

export default RadioCheckbox;
