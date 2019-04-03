import {toRegistrationServiceFormat, toRulesServiceFormat} from './json-transform';
import testData from '../test-data';

test('Transform test data to registration service format', () => {
    expect(toRegistrationServiceFormat(testData)).toEqual({
        disaster_id: 11,
        preferred_language: "en",
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
        money_on_hand: 1000,
        has_inaccessible_liquid_resources: false,
        has_lost_or_inaccessible_income: true,
        purchased_or_plans_to_purchase_food: true,
        disaster_expenses: {
            food_loss: 129,
            home_or_business_repairs: 0,
            temporary_shelter_expenses: 550,
            evacuation_expenses: 0,
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
                income: {
                    self_employed: 0,
                    unemployment: 200,
                    cash_assistance: 0,
                    disability: 0,
                    social_security: 0,
                    veterans_benefits: 0,
                    alimony: 0,
                    child_support: 0,
                    other_sources: 0,
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
                income: {
                    self_employed: 10000,
                    unemployment: 0,
                    cash_assistance: 0,
                    disability: 0,
                    social_security: 0,
                    veterans_benefits: 0,
                    alimony: 0,
                    child_support: 0,
                    other_sources: 0,
                },
                jobs: []
            },
        ]
    });
});

test('Transform registration to rules service format', () => {
    expect(toRulesServiceFormat(toRegistrationServiceFormat(testData))).toEqual({
        accessible_liquid_resources: 1000,
        disaster_expenses: {
            evacuation_expenses: 0,
            food_loss: 129,
            home_or_business_repairs: 0,
            other: 1000,
            temporary_shelter_expenses: 550,
        },
        disaster_id: 11,
        has_inaccessible_liquid_resources: false,
        has_lost_or_inaccessible_income: true,
        is_authorized_representative: false,
        is_head_of_household: true,
        purchased_or_plans_to_purchase_food: true,
        receives_SNAP_benefits: false,
        resided_in_disaster_area_at_disaster_time: true,
        residence_state: "FL",
        size_of_household: 2,
        total_take_home_income: 10200,
        worked_in_disaster_area_at_disaster_time: false,
    });
});
