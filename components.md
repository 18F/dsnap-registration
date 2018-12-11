## general components
**PageHeader**
  props:
  - text
  - style?

**ContentHeader**
  _probably just a wrapper for a component with an `h{n}` tag, text and an `hr`
  props:
  - text, possibly
  - headerType?


**Button**
  props:
  - type (success | error | link)
  - value

**Alert**
  props:
  - type ( info )
  - copy

**Expandable**
  Alerts can most likely be decorated with these

  props:
  - type( success )
  - header
  - content

**Jumbotron**
  props:
  - type ( success )
  - text


## form fields

**Dropdown**
  props:
  - selectedValue
  - defaultValue
  - options

### inputs

All inputs need at least:
  - labelText
  - name
  - value
  - optional(?)
  - required (?)
  - placeholder / exampleValue / explanation / additionalInfo

**Text**
**Number**
**Money**
  _probably just a number field with additional validations if required_
**DateGroup**
  **Date**
**CheckboxGroup**
  props:
  - options
    **Checkbox**
**RadioGroup**
  props:
  - options
    **Radio**
**SSN**

## wizard

**Wizard**
**StepIndicator**
**Step**
  **ConfirmationStep**