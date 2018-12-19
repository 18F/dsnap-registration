import React from 'react';
import { shallow } from  'enzyme';
import Header from './index';

describe('<Header />', () => {
  const props = {
    text: 'hello',
  };

  let component;

  beforeEach(() => {
    component = shallow(<Header {...props} />);
  });

  it('renders a header element', () => {
    expect(component.find('header').length).toBe(1);
  });

  it('accepts a single prop for `text`', () => {
    expect(component.find('span.site-title').text()).toEqual(props.text);
  });
});
