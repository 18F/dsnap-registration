export default {
  "basicInfo":{
     "personId": 0,
     "preferredLanguage": "en",
     "disasterIndex": "11",
     "disasterCounty": "Baker",
     "phone":"2165555555",
     "email":"adam@email.biz",
     "residenceAddress":{
        "street1":"250 Oakland Way",
        "street2":"",
        "city":"Oakland",
        "state":"FL",
        "zipcode":"94612"
     },
     "mailingAddress":{
        "street1":"365 Campus Rd",
        "street2":"",
        "city":"Cleveland",
        "state":"OH",
        "zipcode":"44121"
     },
     "currentMailingAddress":"false",
     "stateId":"Y9456A7",
     "moneyOnHand":"1000",
  },
  "household":{
     "numMembers":1,
     "currentMemberIndex":0,
     "members":[
        {
           "name":{
              "firstName":"Adam",
              "middleName":"",
              "lastName":"B"
           },
           "dob":{
              "month":"01",
              "day":"01",
              "year":"1989"
           },
           "sex":"male",
           "ssn":"111111111",
           "race":"",
           "ethnicity": "Not Hispanic or Latino",
           "hasFoodAssistance":false,
           "hasOtherJobs":"no",
           "hasJobs":true,
           "assetsAndIncome":{
              "hasIncome":true,
              "incomeSources":{
                 "selfEmployed":{
                    "applicable":false,
                    "value":0
                 },
                 "unemployment":{
                    "applicable":true,
                    "value":200
                 },
                 "cashAssistance":{
                    "applicable":false,
                    "value":0
                 },
                 "disability":{
                    "applicable":false,
                    "value":0
                 },
                 "socialSecurity":{
                    "applicable":false,
                    "value":0
                 },
                 "veteransBenefits":{
                    "applicable":false,
                    "value":0
                 },
                 "alimony":{
                    "applicable":false,
                    "value":0
                 },
                 "childSupport":{
                    "applicable":false,
                    "value":0
                 },
                 "otherSources":{
                    "applicable":false,
                    "value":0
                 }
              },
              "jobs":[
                 {
                    "employerName":"TTS",
                    "pay":"1000",
                    "isDsnapAgency":"false"
                 },
                 {
                    "employerName":"Apollo",
                    "pay": "500",
                    "isDsnapAgency":"false"
                 },
              ]
           }
        },
        {
          "name":{
             "firstName":"Bob",
             "middleName":"",
             "lastName":"Ross"
          },
          "dob":{
             "month":"01",
             "day":"01",
             "year":"1949"
          },
          "sex":"male",
          "ssn":"111111112",
          "race":"",
          "ethnicity": "",
          "hasFoodAssistance":false,
          "hasOtherJobs":"no",
          "hasJobs":true,
          "assetsAndIncome":{
             "hasIncome":true,
             "incomeSources":{
                "selfEmployed":{
                   "applicable":true,
                   "value":10000
                },
                "unemployment":{
                   "applicable":false,
                   "value":0
                },
                "cashAssistance":{
                   "applicable":false,
                   "value":0
                },
                "disability":{
                   "applicable":false,
                   "value":0
                },
                "socialSecurity":{
                   "applicable":false,
                   "value":0
                },
                "veteransBenefits":{
                   "applicable":false,
                   "value":0
                },
                "alimony":{
                   "applicable":false,
                   "value":0
                },
                "childSupport":{
                   "applicable":false,
                   "value":0
                },
                "otherSources":{
                   "applicable":false,
                   "value":0
                }
             },
             "jobs":[],
          }
       }
     ]
  },
  "impact":{
     "lostOrInaccessibleIncome":"true",
     "inaccessibleMoney":"false",
     "buyFood":"false",
     "noOtherExpenses":false,
     "otherExpenses":{
        "foodLoss":{
           "applicable":true,
           "value":129
        },
        "evacuation":{
           "applicable":false,
           "value":0
        },
        "tempShelter":{
           "applicable":true,
           "value": 550
        },
        "repairs":{
           "applicable":false,
           "value":0
        },
        "other": {
           applicable: true,
           value: 1000
        }
     }
  },
  "resources":{
     "membersWithIncome": []
  },
  "currentSection":"basic-info",
  "currentStep":"applicant-name",
  "previousStep":"",
  "previousSection":"",
  "totalSteps":6,
  "step":1,
  config: {
     useLocalStorage: true,
     language: 'en',
     disaster: ''
  },
  meta: {
     loading: undefined
  },
  submit: {
   acceptedTerms: null,
   readAgreement: '',
   signature: '',
  },
  disasters: {
     "data":{
        "11": {
           "id":11,
           "application_periods": [{
              "begin_date":"2019-03-08",
              "end_date":"2020-01-04",
              "registration_begin_date":"2019-03-01",
              "registration_end_date":"2019-06-08",
              "counties":["Alachua","Baker","Bay","Bradford","Brevard","Broward","Calhoun","Charlotte","Citrus","Clay","Collier","Columbia","DeSoto","Dixie","Duval","Escambia","Flagler","Franklin","Gadsden","Gilchrist","Glades","Gulf","Hamilton","Hardee","Hendry","Hernando","Highlands","Hillsborough"]
            }],
            "disaster_request_no":"DR-4285",
            "title":"Matthew",
            "benefit_begin_date":"2018-03-01",
            "benefit_end_date":"2018-05-31",
            "residency_required":true,
            "uses_DSED":false,
            "allows_food_loss_alone":true,
            "state":"NC",
            "description": "disaster that wasn't great"
         }
      }
   }
};
