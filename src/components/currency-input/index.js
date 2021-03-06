import React from 'react';
import PropTypes from 'prop-types';
import FormikField from 'components/formik-field';

class CurrencyInput extends React.Component {
  static propsTypes = {
    groupClassName: PropTypes.string
  }

  static defaultProps = {
    groupClassName: 'currency-field'
  }

  constructor(props) {
    super(props);

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleFocus = (event, _, { setFieldValue }) => {
    const { value } = event.target;

    if (Number(value) === 0) {
      setFieldValue(this.props.name, '', true);
    }
  }

  handleBlur = (_, field, { setFieldValue }) => {
    if (field.value === '') {
      setFieldValue(this.props.name, '0', true);
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target;

    this.props.onChange(name, value.replace(/[^\d]/g, ''));
  }

  render() {
    const { onChange, ...rest } = this.props;

    return (
      <FormikField
        className="desktop:grid-col-2"
        groupClassName={this.props.groupClassName}
        prefix="$"
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        {...rest}    
      />
    );
  }
}

export default CurrencyInput;
