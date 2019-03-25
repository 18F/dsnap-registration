import {toRegistrationServiceFormat} from './jsonTransform';

const testData = {
  basicInfo: {
     personId: 0,
     phone: "2165555555",
     email: "adam@email.biz",
     residenceAddress: {
        street1: "250 Oakland Way",
        street2: "",
        city: "Oakland",
        state: "CA",
        zipcode: "94612"
     },
     mailingAddress: {
        street1: "365 Campus Rd",
        street2: "",
        city: "Cleveland",
        state: "OH",
        zipcode: "44121"
     },
     county: "Alameda",
     currentMailingAddress: "false"
  },
  identity: {
     personalInfo: {
        stateId: "Y9456A7"
     }
  },
  household: {
     numMembers: 1,
     currentMemberIndex: 0,
     members: [
        {
           name: {
              firstName: "Adam",
              middleName: "",
              lastName: "B"
           },
           dob: {
              month: "01",
              day: "01",
              year: "1989"
           },
           sex: "male",
           ssn: "111111111",
           race: "",
           hasFoodAssistance: false,
           hasOtherJobs: "no",
           hasJobs: true,
           assetsAndIncome: {
              hasIncome: true,
              incomeSources: {
                 selfEmployed: {
                    applicable: false,
                    value: null
                 },
                 unemployment: {
                    applicable: true,
                    value: 200
                 },
                 cashAssistance: {
                    applicable: false,
                    value: null
                 },
                 disability: {
                    applicable: false,
                    value: null
                 },
                 socialSecurity: {
                    applicable: false,
                    value: null
                 },
                 veteransBenefits: {
                    applicable: false,
                    value: null
                 },
                 alimony: {
                    applicable: false,
                    value: null
                 },
                 childSupport: {
                    applicable: false,
                    value: null
                 },
                 otherSources: {
                    applicable: false,
                    value: null
                 }
              },
              jobs: [
                 {
                    employerName: "TTS",
                    pay: "1000",
                    isDsnapAgency: "no"
                 },
                 {
                    employerName: "Apollo",
                    pay: "500",
                    isDsnapAgency: "no"
                 },
              ],
              moneyOnHand: "1000"
           }
        },
        {
          name: {
             firstName: "Bob",
             middleName: "",
             lastName: "Ross"
          },
          dob: {
             month: "01",
             day: "01",
             year: "1949"
          },
          sex: "male",
          ssn: "111111112",
          race: "",
          hasFoodAssistance: false,
          hasOtherJobs: "no",
          hasJobs: true,
          assetsAndIncome: {
             hasIncome: true,
             incomeSources: {
                selfEmployed: {
                   applicable: true,
                   value: 10000
                },
                unemployment: {
                   applicable: false,
                   value: null
                },
                cashAssistance: {
                   applicable: false,
                   value: null
                },
                disability: {
                   applicable: false,
                   value: null
                },
                socialSecurity: {
                   applicable: false,
                   value: null
                },
                veteransBenefits: {
                   applicable: false,
                   value: null
                },
                alimony: {
                   applicable: false,
                   value: null
                },
                childSupport: {
                   applicable: false,
                   value: null
                },
                otherSources: {
                   applicable: false,
                   value: null
                }
             },
             jobs: [
               //  {
               //     employerName: "USPS",
               //     pay: "10000",
               //     isDsnapAgency: "no"
               //  },
             ],
             moneyOnHand: "5"
          }
       }
     ]
  },
  impact: {
     lostOrInaccessibleIncome: "yes",
     inaccessibleMoney: "no",
     buyFood: "yes",
     noOtherExpenses: false,
     otherExpenses: {
        foodLoss: {
           applicable: true,
           value: 129
        },
        evacuation: {
           applicable: false,
           value: null
        },
        tempShelter: {
           applicable: true,
           value: 550
        },
        repairs: {
           applicable: false,
           value: null
        },
        other: {
           applicable: true,
           value: 1000
        }
     }
  },
  resources: {
     membersWithIncome: []
  },
  currentSection: "basic-info",
  currentStep: "applicant-name",
  previousStep: "",
  previousSection: "",
  totalSteps: 6,
  step: 1,
  newJob: {
     employerName: "",
     pay: "",
     isDsnapAgency: null
  },
  config: {
     useLocalStorage: true,
     language: 'en',
     disaster: ''
  }
};


test('Top-level info', () => {
    expect(toRegistrationServiceFormat(testData)).toEqual({
        phone: "2165555555",
        email: "adam@email.biz",
        residential_address: {
            street1: "250 Oakland Way",
            street2: "",
            city: "Oakland",
            state: "CA",
            zipcode: "94612"
        },
        mailing_address: {
            street1: "365 Campus Rd",
            street2: "",
            city: "Cleveland",
            state: "OH",
            zipcode: "44121"
        },
        county: "Alameda",
        state_id: "Y9456A7",
        has_inaccessible_liquid_resources: false,
        has_lost_or_inaccessible_income: true,
        purchased_or_plans_to_purchase_food: true,
        disaster_expenses: {
            food_loss: 129,
            home_or_business_repairs: null,
            temporary_shelter_expenses: 550,
            evacuation_expenses: null,
            other: 1000
        },
        household: [
            {
                first_name: "Adam",
                middle_name: "",
                last_name: "B",
                dob: "1989-01-01",
                sex: "male",
                ssn: "111111111",
                race: "",
                has_food_assistance: false,
                money_on_hand: 1000,
                income: {
                    self_employed: null,
                    unemployment: 200,
                    cash_assistance: null,
                    disability: null,
                    social_security: null,
                    veterans_benefits: null,
                    alimony: null,
                    child_support: null,
                    other_sources: null,
                },
                jobs: [
                 {
                    employer_name: "TTS",
                    pay: 1000,
                    is_dsnap_agency: false
                 },
                 {
                    employer_name: "Apollo",
                    pay: 500,
                    is_dsnap_agency: false
                 },
              ],
            },
            {
                first_name: "Bob",
                middle_name: "",
                last_name: "Ross",
                dob: "1949-01-01",
                sex: "male",
                ssn: "111111112",
                race: "",
                has_food_assistance: false,
                money_on_hand: 5,
                income: {
                    self_employed: 10000,
                    unemployment: null,
                    cash_assistance: null,
                    disability: null,
                    social_security: null,
                    veterans_benefits: null,
                    alimony: null,
                    child_support: null,
                    other_sources: null,
                },
                jobs: []
            },
        ]
    });
});
