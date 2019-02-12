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
  routes: [
    {
      path: '/form/identity/personal-info',
      component: Steps.Identity.PersonalInfo,
    }
  ]
}];
