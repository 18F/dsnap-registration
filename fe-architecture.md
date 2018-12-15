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
**ProgressIndicator**
**Section**
**Step**
**ConfirmationStep**
  - this is one of the 6 app steps
  - not sure yet how the review will be handled 

The designs specify that the form consists of a progress indicator and a form.
The indicator tracks the overall progress of the **section**s the user has completed,
but not the progress of the number of completed **steps** within that section.

Although it is not exposed to the user, the wizard will probably still want track the step progress.
Could be useful for routing, validations, knowing when we need to move the wizard into the next section.

We'll know a step is complete when all validations on the page pass. This means that the steps themselves
should have a wizard behavior (although they will lack the previous and next buttons)

Employment info is a bit confusing and has a loop clause:
  for each household benefit recipient
    if they select they have one or more jobs
      show employment screen until they select 'no other jobs'

## data design

Each of these should correlate to a reducer, or to some kind data object

I think we can probably normalize this data? might be overkill

**personal**
  - name:
    - `firstName<string>`
    - `middleName<string>`
    - `lastName<string>`
  - dob:
    - `month<number>`
    - `day<number>`
    - `year<number>`
  - `sex<string>`
  - `ssn<string>`

**address**
  - `streetAddress1<string>`
  - `streetAddress2<string>`
  - `city<string>`
  - `state<string>`
  - `zip<number>|<string?>`

**expenses**
  - `repairs<number>`
  - `tempShelter<number>`
  - `evacuation<number>`
  - `foodLoss<number>`
  - `propertyProtection<number>`
  - `medicalPersonalInjury<number>`
  - `funeral<number>`
  - `petBoarding<number>`
  - `itemReplacement<number>`
  - `heatingFuel<number>`
  - `cleaningItems<number>`
  - `vehicleDamage<number>`
  - `storage<number>`

we should just be able to compute total via a reduce op

**employmentInfo**
  - `employer<string>`
  - `totalIncome<number>`
  - `isStateAgency<bool>`

**general**
  - `languages<string| enum en|sp >`
  - `householdMembers<number>`
  - `agreeToSign<bool>`?

**basicInfo** (this is a section)
  - `personal<personal>`
  - `idNumber<string>`
  - `phone<string>|<number?>`
  - `email<string>`
  - `county<string>`
  - `residenceAddress<address>`
  - `mailingAddressSame<bool>`
  - `mailingAddress<address>` ( only needs to be validated when above is false )

    #### questions
      * do we need to handle international numbers?
      * do we care about international mailing addresses?
      * since applicants don't have to be citizens (or residents?) how likely is this to come up
      * is it a safe assumption that the county should always be the county in which they are applying to receive benefits?
        if so, is this captured in the backend so we can validate it there?

**householdInfo** ( this is a section )
  - `memberInfo:<array>[<personal>]`

The number of people in the memberInfo section should correspond to the number indicated in the `general` reducer.

**disasterImpact** ( this is a section )
  - `lostOrInacessibleIncome<bool>`
  - `inaccessibleMoney<bool>`
  - `buyFood<bool>`
  - `expenses<expenses>`

**money** ( this is a section )
 - `totalOnHand<number>`
 - `incomeRecipients<array>[ids of recipients]`
 - `hasJob<bool>`
 - employment:
    - `employers<array>[employmentInfo]`
    - `hasAnotherJob<bool>`
      - continue to ask for additional employers until hasAnotherJob is false (if null, don't allow submission)

    #### questions
      * how should we encode the income recipients? - just a list of the household members 
      * does having another job trigger more info or additional screens?

