import Sections from 'pages/form/sections';
import Steps from 'pages/form/steps';

export default [{
  path: '/form/basic-info',
  component: Sections.BasicInfoSection,
  routes: [
    {
      path: '/form/basic-info/applicant-name',
      component: Steps.ApplicantName,
    }
  ]
}];