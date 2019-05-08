import React from 'react';
import i18n from 'i18n';

// TODO: These can actually just be better-named components
const renderListT = ({ name }) => {
  const array = i18n.t(`${name}`, { returnObjects: true });

  if (!Array.isArray(array)) {
    return null;
  }

  return (
    <ul className="margin-y-0 bulleted">
      {
        i18n.t(`${name}`, { returnObjects: true })
          .map((text, index) => {
            return (
              <li
                className="margin-y-025"
                key={`${name}.conditions.${index}`}
              >
                { i18n.t(text, {escapeValues: false}) }
              </li>
            );
          })
      }
    </ul>
  );
}

const renderLineBreaksT = name => (
  <React.Fragment>
    {
      i18n.t(`${name}`).split('\n').map((text, index) => (
        <p key={`${name}.${index}`}>
          {text}
        </p>
      ))
    }
  </React.Fragment>
);

const getEnumeratedValues = (name) =>
  i18n.t(name, { returnObjects: true })
    .map((value) => ({
      label: value,
      value
    }));

export default {
  renderListT,
  renderLineBreaksT,
  getEnumeratedValues,
};
