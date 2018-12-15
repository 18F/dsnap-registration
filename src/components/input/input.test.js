import React from 'react';
import { shallow } from 'enzyme';
import Input from './index';

const props = {
  className: 'test-field-class',
  value: '',
  name: 'test-input',
  labelText: 'type here',
  labelClassName: 'test-label-class',
  onChange: jest.fn()
};

describe('<Input />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Input {...props} />);
  });

  it('renders a label', () => {
    expect(component.find('label').find('b').text()).toBe(props.labelText);
  });

  it('renders secondary label text when provided', () => {
    const secondaryText = 'additional info etc.';
    component = shallow(<Input {...props} labelSecondaryText={secondaryText} />);

    expect(component.find('label').find('p').text()).toBe(secondaryText);
  });

  it('passes className additions to label', () => {
    expect(component.find('label').prop('className')).toContain(props.labelClassName)
  });

  it('passes className additions to input field', () => {
    expect(component.find('input').prop('className')).toContain(props.className);
  });

  it('renders errors when supplied as props', () => {
    const errors = [{message: 'this field cannot be blank'}];

    component = shallow(<Input {...props} errors={errors} />);

    expect(component.find('InputError').length).toBe(1);
    expect(component.find('InputError').prop('message')).toBe(errors[0].message);
  });

  describe('event handling', () => {
    it('calls its onChange handler', () => {
      const value = 'hello';
      const eventData = { target: { value } };
      const mock = props.onChange.mock;

      component.find('input').simulate('change', eventData);

      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0][0]).toBe(value);
    });
  });
});
