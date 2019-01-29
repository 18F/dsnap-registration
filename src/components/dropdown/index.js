import React from 'react';
import PropTypes from 'prop-types';
import { Field, ErrorMessage } from 'formik';
import InputError from 'components/error';

const propTypes = {
  explanation: PropTypes.string,
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string,
    })
  ).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
}

class Dropdown extends React.Component {
  static propTypes = propTypes

  mapOptions() {
    return this.props.options.map((option, index) => (
      <option
        key={`${option.value}-${index}`}
        value={option.value}>
        {option.text}
      </option>
    ));
  }

  render() {
    const { name } = this.props;

    return (
      <>
        <label className="usa-label" htmlFor={name}>
          {this.props.labelText}
        </label>
        <Field
          name={name}
          render={({ field }) => {
            return (
              <div>
                <select
                  className="usa-select"
                  name={name}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                >
                  {this.mapOptions()}
                </select>
                <ErrorMessage name={name}>
                  { (message) => <InputError message={message} /> }
                </ErrorMessage>
              </div>
            );
          }}
        />
      </>
    );
  }
}

export default Dropdown;