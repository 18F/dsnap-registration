import React from 'react';
import i18n from 'i18n';

const renderListT = ({ name }) => (
  <ul className="margin-y-0 bulleted">
    {
      i18n.t(`${name}`, { returnObjects: true })
        .map((text, index) => {
          return (
            <li
              className="margin-y-1"
              key={`${name}.conditions.${index}`}
            >
              { i18n.t(text) }
            </li>
          );
        })
    }
  </ul>
);

const renderLineBreaksT = name => (
  <>
    {
      i18n.t(`${name}`).split('\n').map((text, index) => (
        <p key={`${name}.${index}`}>
          {text}
        </p>
      ))
    }
  </>
)

export default {
  renderListT,
  renderLineBreaksT,
};
