import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
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
  mapOptions() {
    return this.props.options.map((option, index) =>
      <option
        key={`${option.value}-${index}`}
        value={option.value}>
        {option.text}
      </option>
    );
  }

  render() {
    return (
      <React.Fragment>
        <label className="usa-label" htmlFor={this.props.name}>
          {this.props.labelText}
        </label>
        <select
          className="usa-select"
          name={this.props.name}
          onChange={this.props.onSelect}
          value={this.props.value}
        >
          {this.mapOptions()}
        </select>
      </React.Fragment>
    );
  }
}

Dropdown.propTypes = propTypes;
Dropdown.defaultProps = {
  onSelect: (event) => console.log(event.target.value),
  value: ''
};

export default Dropdown;
