import React from 'react';
import { shallow } from 'enzyme';
import Input from './index';

const props = {
  className: 'test-field-class',
  value: '',
  name: 'test-input',
  labelText: 'type here',
  labelClassName: 'test-label-class',
  onChange: jest.fn(),
  formik: { errors: { } }
};

describe('<Input />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Input.WrappedComponent {...props} />);
  });

  it('renders a label', () => {
    expect(component.find('label').find('b').text()).toBe(props.labelText);
  });

  it('renders secondary label text when provided', () => {
    const secondaryText = 'additional info etc.';
    component = shallow(<Input.WrappedComponent {...props} explanation={secondaryText} />);

    expect(component.find('label').find('span').text()).toBe(secondaryText);
  });

  it('passes className additions to label', () => {
    expect(component.find('label').prop('className')).toContain(props.labelClassName)
  });

  it('passes className additions to input field', () => {
    expect(component.find('input').prop('className')).toContain(props.className);
  });

  it('renders errors when supplied as props', () => {
    const message = 'this field cannot be blank';
    const error = {
      errors: {
        [props.name]: message
      }
    };

    const finalProps = {
      ...props,
      formik: error
    };

    component = shallow(<Input.WrappedComponent {...finalProps} />);
    
    expect(component.hasClass('usa-form-group-error')).toBe(true);
  });

  describe('event handling', () => {
    it('calls its onChange handler', () => {
      const value = 'hello';
      const eventData = { target: { value } };
      const mock = props.onChange.mock;

      component.find('input').simulate('change', eventData);

      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0][0]).toBe(eventData);
    });
  });
});
