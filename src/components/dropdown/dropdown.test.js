import React from 'react';
import { shallow } from 'enzyme';
import Dropdown from './index';

const props = {
  labelText: 'label',
  name: 'dropdown',
  onSelect: jest.fn(),
  options: [
    {
      value: null,
      text: 'Select a state'
    },
    {
      value: 'OH',
      text: 'Ohio'
    }
  ]
};

describe('<Dropdown />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Dropdown {...props} />);
  });

  it('accepts props to control label text', () => {
    expect(component.find('label').text()).toBe(props.labelText);
  });
});
