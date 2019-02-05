import Sections from 'pages/form/sections';
import Steps from 'pages/form/steps';

export default [{
  path: '/form/basic-info',
  component: Sections.BasicInfoSection,
  next: '/form/identity',
  routes: [
    {
      path: '/form/basic-info/applicant-name',
      component: Steps.ApplicantName,
      next: '/form/basic-info/address',
    },
    {
      path: '/form/basic-info/address',
      component: Steps.ResidenceAddress,
    },
    {
      path: '/form/basic-info/mailing-address',
      component: Steps.MailingAddress,
      optional: true,
      next: '/form/basic-info/complete',
    },
    {
      path: '/form/basic-info/shortcut',
      component: Steps.BasicInfoOffRamp,
      next: '/forms/identity',
    }
  ]
}];
