import React from 'react';
import PropTypes from 'prop-types';
import Input from 'components/input';

// Invalid character are, for now, defined as any non-alpha numeric character
const invalidCharsRegexp = new RegExp('[^\\dA-Za-z]', 'g');

class MaskedInput extends React.Component {
  static propTypes = {
    delimiter: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(RegExp)
    ]),
    pattern: PropTypes.string,
  }

  static defaultProps = {
    delimiter: '-',
    pattern: 'XXX-XX-XXXX'
  }

  trimRemaining(string, length) {
    return string.slice(0, length);
  }

  demask(value, delimiter, invalidChars) {
    return String(value)
      .split(delimiter)
      .join('')
      .replace(invalidChars, '');
  }

  processMask(valueToMask, delimiter, pattern) {
    const valLen = valueToMask.length;
    let valuePtr = 0;
    let patternPtr = 0;
    let memo = '';

    while (valuePtr < valLen) {
      const currPattern = pattern[patternPtr];
      let nextChar;

      if (currPattern === delimiter) {
        nextChar = delimiter;
        patternPtr += 1;
      } else {
        nextChar = valueToMask[valuePtr];
        valuePtr += 1;
        patternPtr += 1;
      }

      memo = `${memo}${nextChar}`
    }

    return memo;
  }

  formatValue(value) {
    const { pattern, delimiter } = this.props;
    const demaskedValue = this.demask(value, delimiter, invalidCharsRegexp);
    const rawMaskedValue = this.processMask(demaskedValue, delimiter, pattern);

    return this.trimRemaining(rawMaskedValue, pattern.length);
  }

  handleChange = (event) => {
    const { name, value } = event.target;

    this.props.onChange(name, this.formatValue(value));
  }

  render() {
    const { onChange, children, ...rest } = this.props;

    return (
      <Input
        onChange={this.handleChange}
        {...rest}
      >
        { children }
      </Input>
    )
  }
}

export default MaskedInput;
