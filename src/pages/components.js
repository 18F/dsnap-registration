import React from 'react';
import Collapsible from '../components/collapsible';
import RadioCheckbox from '../components/radio-checkbox';
import Dropdown from '../components/dropdown';
import Input from '../components/input';

export default class extends React.Component {
  state = {
    checkbox: true,
    input: ''
  }

  render() {
    return (
      <>
        <div className="margin-y-2">
          <Collapsible
            headerContent="example collapsible"
            text="herein lies the content"
          />
        </div>
        <div className="usa-form margin-y-2">
          <RadioCheckbox
            type="checkbox"
            name="test"
            checked={this.state.checkbox}
            labelText="apple"
            value="apple"
            onChange={() => this.setState({checkbox: !this.state.checkbox})}
          />
        </div>
        <div className="margin-y-2">
          <RadioCheckbox
            type="radio"
            name="veggies"
            checked={false}
            labelText="tomato"
            value="tomato"
            onChange={(event) => console.log(event)}
          />
          <RadioCheckbox
            type="radio"
            name="veggies"
            checked={true}
            labelText="squash"
            value="squash"
            onChange={(event) => console.log(event)}
          />
          <Dropdown
            labelText="how to use a dropdown"
            name="my-state-dropdown"
            options={[{value: '', text: 'Select a state'}, {value: 'OH', text: 'Ohio' }]}
          />
        </div>       
        <Input
          value={this.state.input}
          name='test-input'
          labelText='type here'
          labelSecondaryText='additional info etc.'
          onChange={input => this.setState({input})}
          errors={[{message: 'this field cannot be blank'}]}
        />
      </>
    );
  }
}