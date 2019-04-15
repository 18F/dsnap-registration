import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  isDisabled: PropTypes.bool,
  // should the button appear as a link?
  link: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit'])
};

const applyClassNames = (names, isLink) => classNames(names, {
  'usa-button usa-button-primary': !isLink,
  'usa-button-link': isLink,
});

const Button = ({
  type = 'submit',
  children,
  className,
  onClick,
  disabled = false,
  link = false,
}) => (
  <button
    className={applyClassNames(className, link)}
    type={type}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

Button.propTypes = propTypes;

export default Button;
