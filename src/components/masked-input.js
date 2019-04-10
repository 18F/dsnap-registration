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

  mask = null;

  componentWillMount() {
    const { delimiter, pattern } = this.props;

    this.mask = new Mask({ delimiter, pattern });
  }

  handleChange = (event) => { 
    const { name, value } = event.target;

    this.props.onChange(name, this.mask.formatValue(value));
  }

  render() {
    const { onChange, children, value, pattern, delimiter, ...rest } = this.props;

    return (
      <Input
        onChange={this.handleChange}
        value={this.mask.formatValue(value)}
        {...rest}
      >
        { children }
      </Input>
    )
  }
}

export default MaskedInput;
