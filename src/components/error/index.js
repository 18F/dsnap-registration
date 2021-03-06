import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
};

const InputError = ({ message }) => (
  !message || typeof message !== 'string' ?
    null :
    <span
      className="usa-input-error-message"
      role="alert"
    >
      { message }
    </span>
);

InputError.propTypes = propTypes;

export default InputError;
