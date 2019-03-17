import React from 'react';
import PropTypes from 'prop-types';
import withLocale from 'components/with-locale';
import withFormField from 'components/with-form-field';

const propTypes = {
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
  static defaultProps = {
    options: []
  }

  mapOptions() {
    const { t } = this.props;

    let defaultOption = [
      <option key="default" value={null}>{t('general.select')}</option>
    ];

    return this.props.options.reduce((memo, option, index) => (
      [
        ...memo,
        <option
          key={`${option.value}-${index}`}
          value={option.value}
        >
          {option.text}
        </option>
      ]
    ), defaultOption);
  }

  render() {
    const { name } = this.props;

    return (
      <React.Fragment>
        <select
          id={this.props.id}
          className="usa-select"
          name={name}
          onChange={this.props.onChange}
          onBlur={this.props.onBlur}
          value={this.props.value}
        >
          {this.mapOptions()}
        </select>
        { this.props.children }
      </React.Fragment>
    );
  }
}

export default withFormField(withLocale(Dropdown));