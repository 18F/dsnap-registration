import Sections from 'pages/form/sections';
import Steps from 'pages/form/steps';

export default [{
  path: '/form/basic-info',
  component: Sections.BasicInfoSection,
  name: 'basicInfo',
  routes: [
    {
      path: '/form/basic-info/applicant-name',
      component: Steps.BasicInfo.ApplicantName,
    },
    {
      path: '/form/basic-info/address',
      component: Steps.BasicInfo.ResidenceAddress,
    },
    {
      path: '/form/basic-info/mailing-address',
      component: Steps.BasicInfo.MailingAddress,
    },
    {
      path: '/form/basic-info/shortcut',
      component: Steps.BasicInfo.BasicInfoOffRamp,
    }
  ]
}, {
  path: '/form/identity',
  component: Sections.IdentitySection,
  name: 'identity',
  routes: [
    {
      path: '/form/identity/personal-info',
      component: Steps.Identity.PersonalInfo,
    }
  ]
}, {
  path: '/form/household',
  component: Sections.HouseholdSection,
  name: 'household',
  routes: [
    {
      path: '/form/household/how-many',
      component: Steps.Household.HowMany
    },
    {
      path: '/form/household/member-names',
      component: Steps.Household.MemberNames,
    },
    {
      path: '/form/household/get-prepared',
      component: Steps.Household.GetPrepared,
    },
    {
      path: '/form/household/member-details',
      component: Steps.Household.MemberDetails
    },
    {
      path: '/form/household/food-assistance',
      component: Steps.Household.FoodAssistance
    }
  ]
}, {
  path: '/form/impact',
  component: Sections.ImpactSection,
  name: 'impact',
  routes: []
}];
