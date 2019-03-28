import toRegistrationServiceFormat from './json-transform';
import testData from '../test-data';

test('Top-level info', () => {
    expect(toRegistrationServiceFormat(testData)).toEqual({
        disaster_id: 11,
        preferred_language: "English",
        phone: "2165555555",
        email: "adam@email.biz",
        residential_address: {
            street1: "250 Oakland Way",
            street2: "",
            city: "Oakland",
            state: "FL",
            zipcode: "94612"
        },
        mailing_address: {
            street1: "365 Campus Rd",
            street2: "",
            city: "Cleveland",
            state: "OH",
            zipcode: "44121"
        },
        county: "Baker",
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
                ethnicity: "Not Hispanic or Latino",
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
                ethnicity: "",
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
