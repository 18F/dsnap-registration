import React from 'react';
import Button from './components/button';
import LocaleContext from '../locale-context';

const Welcome = () => (
  <LocaleContext.Consumer>
    {(t) => (
      <>
        <h1>Welcome</h1>
        <Button onClick={() =>({})}>
          next
        </Button>
      </>
    )}
  </LocaleContext.Consumer>
);
