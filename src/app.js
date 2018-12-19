import React from 'react';
import LocaleContext from './locale-context';

export default class App extends React.Component {
  render() {
    return (
      <LocaleContext.Consumer>
        {(t) => {
          return (
            <h1>placeholder</h1>
          );
        }}
      </LocaleContext.Consumer>
    );
  }
}
