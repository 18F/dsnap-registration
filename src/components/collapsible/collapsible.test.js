import React from 'react';
import { shallow } from 'enzyme';
import Collapsible from './index';

const defaultProps = {
  header: 'header',
};
const MockComponent = () => <div></div>;

describe('<Collapsible />', () => {
  it('accepts children as a prop', () => {    
    const component = shallow(
      <Collapsible {...defaultProps}>
        <MockComponent />
      </Collapsible>
    );

    expect(component.children().find(MockComponent).length).toEqual(1);
  });

  it('falls back to `text` prop when no children are provided', () => {
    const body = 'sample text';
    const props = {
      body,
      ...defaultProps,
    };
    const component = shallow(<Collapsible {...props} />);

    expect(component.find('CollapsibleContent').prop('children')).toEqual(body);
  });

  it('defaults to hiding its content', () => {
    const component = shallow(<Collapsible {...defaultProps} />);

    expect(component.state('collapsed')).toEqual(true);
  });

  it('expands and collapses properly on click', () => {
    const component = shallow(<Collapsible {...defaultProps} />);

    component.find('button').simulate('click', { preventDefault() {} });
    component.update();

    expect(component.state('collapsed')).toEqual(false);
  });
});
