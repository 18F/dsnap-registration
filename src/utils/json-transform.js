import {isAffirmative} from 'utils';

function toRegistrationServiceFormat(src) {
    return {
        disaster_id: Number(src.basicInfo.disasterIndex),
        preferred_language: src.basicInfo.preferredLanguage,
        phone: src.basicInfo.phone,
        email: src.basicInfo.email,
        residential_address: src.basicInfo.residenceAddress,
        mailing_address: src.basicInfo.mailingAddress,
        county: src.basicInfo.disasterCounty,
        state_id: src.basicInfo.stateId,
        has_inaccessible_liquid_resources: isAffirmative(src.impact.inaccessibleMoney),
        has_lost_or_inaccessible_income: isAffirmative(src.impact.lostOrInaccessibleIncome),
        purchased_or_plans_to_purchase_food: isAffirmative(src.impact.buyFood),
        disaster_expenses: {
            food_loss: src.impact.otherExpenses.foodLoss.value,
            home_or_business_repairs: src.impact.otherExpenses.repairs.value,
            temporary_shelter_expenses: src.impact.otherExpenses.tempShelter.value,
            evacuation_expenses: src.impact.otherExpenses.evacuation.value,
            other: src.impact.otherExpenses.other.value
        },
        household: assembleHousehold(src)
    };
}

function assembleHousehold(src) {
    return src.household.members.map( member => {
        return {
            first_name: member.name.firstName,
            middle_name: member.name.middleName,
            last_name: member.name.lastName,
            dob: `${member.dob.year}-${member.dob.month}-${member.dob.day}`,
            sex: member.sex,
            ssn: member.ssn,
            race: member.race,
            has_food_assistance: member.hasFoodAssistance, // What is this used for? TODO
            money_on_hand: Number(member.assetsAndIncome.moneyOnHand),
            income: {
                 self_employed: member.assetsAndIncome.incomeSources.selfEmployed.value,
                 unemployment: member.assetsAndIncome.incomeSources.unemployment.value,
                 cash_assistance: member.assetsAndIncome.incomeSources.cashAssistance.value,
                 disability: member.assetsAndIncome.incomeSources.disability.value,
                 social_security: member.assetsAndIncome.incomeSources.socialSecurity.value,
                 veterans_benefits: member.assetsAndIncome.incomeSources.veteransBenefits.value,
                 alimony: member.assetsAndIncome.incomeSources.alimony.value,
                 child_support: member.assetsAndIncome.incomeSources.childSupport.value,
                 other_sources: member.assetsAndIncome.incomeSources.otherSources.value,
            },
            jobs: assembleJobs(member),
        }
    });
}

function assembleJobs(member) {
    return member.assetsAndIncome.jobs.map(job => {
        return {
            employer_name: job.employerName,
            pay: Number(job.pay),
            is_dsnap_agency: isAffirmative(job.isDsnapAgency)
        }
    });
}

export default toRegistrationServiceFormat;
