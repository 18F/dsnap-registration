import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
  classNames: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit'])
};

const applyClassNames = names => classNames('usa-button usa-button-primary', names);

const Button = ({
  type = 'submit',
  children,
  classNames,
  onClick,
  disabled = false
}) => (
  <button
    className={applyClassNames(classNames)}
    type={type}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

Button.propTypes = propTypes;

export default Button;