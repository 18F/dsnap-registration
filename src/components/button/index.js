import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
  className: PropTypes.oneOfType([
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
  className,
  onClick,
  disabled = false
}) => (
  <button
    className={applyClassNames(className)}
    type={type}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

Button.propTypes = propTypes;

export default Button;
