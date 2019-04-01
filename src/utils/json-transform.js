import { isAffirmative, stripSpecialChars } from 'utils';

const emptyToNull = value =>
  typeof value === 'string' && !value.length ? null : value;

function toRegistrationServiceFormat(src) {
    return {
        disaster_id: Number(src.basicInfo.disasterIndex),
        preferred_language: src.config.language.trim(),
        phone: stripSpecialChars(src.basicInfo.phone),
        email: src.basicInfo.email.trim(),
        residential_address: src.basicInfo.residenceAddress,
        mailing_address: src.basicInfo.mailingAddress,
        county: src.basicInfo.disasterCounty.trim(),
        state_id: src.basicInfo.stateId.trim(),
        has_inaccessible_liquid_resources: isAffirmative(src.impact.inaccessibleMoney),
        has_lost_or_inaccessible_income: isAffirmative(src.impact.lostOrInaccessibleIncome),
        purchased_or_plans_to_purchase_food: isAffirmative(src.impact.buyFood),
        disaster_expenses: {
            food_loss: Number(src.impact.otherExpenses.foodLoss.value),
            home_or_business_repairs: Number(src.impact.otherExpenses.repairs.value),
            temporary_shelter_expenses: Number(src.impact.otherExpenses.tempShelter.value),
            evacuation_expenses: Number(src.impact.otherExpenses.evacuation.value),
            other: Number(src.impact.otherExpenses.other.value)
        },
        household: assembleHousehold(src)
    };
}

function assembleHousehold(src) {
    return src.household.members.map( member => {
        return {
            first_name: member.name.firstName.trim(),
            middle_name: member.name.middleName.trim(),
            last_name: member.name.lastName.trim(),
            dob: `${member.dob.year.trim()}-${member.dob.month.trim()}-${member.dob.day.trim()}`,
            sex: member.sex.trim(),
            ssn: emptyToNull(stripSpecialChars(member.ssn.trim())),
            race: member.race.trim(),
            ethnicity: member.ethnicity.trim(),
            has_food_assistance: isAffirmative(member.hasFoodAssistance),
            money_on_hand: Number(member.assetsAndIncome.moneyOnHand),
            income: {
                 self_employed: Number(member.assetsAndIncome.incomeSources.selfEmployed.value),
                 unemployment: Number(member.assetsAndIncome.incomeSources.unemployment.value),
                 cash_assistance: Number(member.assetsAndIncome.incomeSources.cashAssistance.value),
                 disability: Number(member.assetsAndIncome.incomeSources.disability.value),
                 social_security: Number(member.assetsAndIncome.incomeSources.socialSecurity.value),
                 veterans_benefits: Number(member.assetsAndIncome.incomeSources.veteransBenefits.value),
                 alimony: Number(member.assetsAndIncome.incomeSources.alimony.value),
                 child_support: Number(member.assetsAndIncome.incomeSources.childSupport.value),
                 other_sources: Number(member.assetsAndIncome.incomeSources.otherSources.value),
            },
            jobs: assembleJobs(member),
        }
    });
}

function assembleJobs(member) {
    return member.assetsAndIncome.jobs.map(job => {
        return {
            employer_name: job.employerName.trim(),
            pay: Number(job.pay),
            is_dsnap_agency: isAffirmative(job.isDsnapAgency)
        }
    });
}

export default toRegistrationServiceFormat;
