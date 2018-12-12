import React from 'react';
import Collapsible from './components/collapsible';
import RadioCheckbox from './components/radio-checkbox';
import Dropdown from './components/dropdown';
import Input from './components/input';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkbox: true,
      input: ''
    };
  }

  render() {
    return (
      <React.Fragment>
        <Collapsible
          headerContent="example collapsible"
          text="herein lies the content"
        />
        <div className="usa-form">
          <ul className="usa-input-list">
          <li>
            <RadioCheckbox
              type="checkbox"
              name="test"
              checked={this.state.checkbox}
              labelText="apple"
              value="apple"
              onChange={() => this.setState({checkbox: !this.state.checkbox})}
            />
            </li>
          </ul>
        </div>
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
        <Input
          value={this.state.input}
          name='test-input'
          labelText='type here'
          labelSecondaryText='additional info etc.'
          onChange={input => this.setState({input})}
          errors={[{message: 'this field cannot be blank'}]}
        />
      </React.Fragment>
    );
  }
}
