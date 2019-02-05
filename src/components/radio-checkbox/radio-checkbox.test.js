import React from 'react';
import { shallow } from 'enzyme';
import RadioCheckbox from './index';

const props = {
  type: 'checkbox',
  checked: false,
  labelText: 'label',
  name: 'checkbox',
  onChange: jest.fn(),
  value: 'hello'
};

describe('<RadioCheckbox />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<RadioCheckbox {...props} />);
  });

  it('renders a label', () => {
    expect(component.find('label').length).toBe(1);
  });

  it('provides label text to its label via props', () => {
    expect(component.find('label').text()).toBe(props.labelText);
  });

  it('renders a checkbox input when provided the checkbox type', () => {
    expect(component.find('input').prop('type')).toBe(props.type);
  });

  it('renders a radio input when provided the radio type', () => {
    component = shallow(<RadioCheckbox {...props} type="radio" />);
    expect(component.find('input').prop('type')).toBe('radio');
  });

  describe('event handlers', () => {
    xit('calls its onChange handler on click', () => {
      const eventData = { target: { value: props.value } }
      component.find('label').simulate('click', eventData);

      expect(props.onChange.mock.calls.length).toBe(1);
      expect(props.onChange.mock.calls[0][0]).toBe(props.value);
    });
  });
});
