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

  it('renders an option tag for each option supplied in props', () => {
    expect(component.find('option').length).toBe(2);
  });

  describe('event handlers', () => {
    it('calls the onSelect handler when a new option is selected', () => {
      const eventData = { target: { value: 'OH'}};

      component.find('select').simulate('change', eventData);
      expect(props.onSelect.mock.calls.length).toBe(1);
      expect(props.onSelect.mock.calls[0][0]).toEqual(eventData);

    });
  });
});
