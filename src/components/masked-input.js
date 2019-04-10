import React from 'react';
import PropTypes from 'prop-types';
import Input from 'components/input';
import { Mask } from 'utils';

class MaskedInput extends React.Component {
  static propTypes = {
    delimiter: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(RegExp)
    ]).isRequired,
    pattern: PropTypes.string.isRequired,
  }

  handleChange = (event) => { 
    const { name, value } = event.target;
    const { pattern, delimiter } = this.props;
    const mask = new Mask({ pattern, delimiter })

    this.props.onChange(name, mask.formatValue(value));
  }

  render() {
    const { onChange, children, value, pattern, delimiter, ...rest } = this.props;
    const mask = new Mask({ pattern, delimiter });

    return (
      <Input
        onChange={this.handleChange}
        value={mask.formatValue(value)}
        {...rest}
      >
        { children }
      </Input>
    )
  }
}

export default MaskedInput;
