import { assign } from 'xstate';
import { isAffirmative, isPrimitive } from 'utils';
import testData from './test-data';
import modelState from 'models';
import config from 'models/config';
import disaster from 'models/disaster';
import { hasMailingAddress } from 'models/basic-info';
import {
  getHouseholdCount,
  getMembers,
  hasAdditionalMembers,
  updateMemberAtIndex,
} from 'models/household';
import { hasJob, hasOtherJobs } from 'models/person';
import { getDisasters } from 'services/disaster';
import { createRegistration } from 'services/registration';
import { createEligibility } from 'services/eligibility';
import job from 'models/job';

const STATE_KEY = 'dsnap-registration';
// ignore these when running the persistence algo, the context is responsible
// for managing the meta state of the machine
const ignoreKeys = [
  'currentSection',
  'currentStep',
  'errors',
  'disasters',
  'meta'
];

const initialState = () => {
  const loadState = process.env.REACT_APP_LOAD_STATE;
  const stateExists = localStorage.getItem(STATE_KEY);

  if (loadState && !stateExists) {
    localStorage.setItem(STATE_KEY, JSON.stringify(testData));
    return testData;
  }

  const machineState = {
    ...modelState,
    currentSection: 'welcome',
    currentStep: '',
    previousStep: '',
    previousSection: '',
    errors: '',
    disasters: disaster(),
    meta: {
      loading: undefined
    },
    config: config(),
    /**
     * totalSteps refers to the number of sections a user will move through
     * while filling out the form. It doesn't necessarily reflect
     * the number of states the machine can be in.
     * 
     * For example, the `quit` state is used internally by the state machine
     * but is not exposed to the user. Therefore, it is not included in the total
     * number of steps
     */
    totalSteps: 6,
  };
  let state;

  try {
    state = JSON.parse(localStorage.getItem(STATE_KEY)) || machineState;
  } catch(error) {
    state = machineState;
  }

  return state;
};

const formNextHandler = (target, extraActions = []) => ({
  NEXT: {
    target,
    internal: true,
    actions: [
      () => console.log(`transitioning to next step ${target}`),
      ...extraActions,
      'persist',
      assign((_, event) => {
        const { type, ...rest } = event;

        return {
          ...rest
        };
      }),
    ]
  }
});

const basicInfoChart = {
  id: 'basic-info',
  internal: true,
  initial: 'applicant-name',
  onEntry: [
    assign({
      currentSection: 'basic-info',
      step: 1,
    }),
    'persist'
  ],
  onExit: [
    assign({ previousSection: 'basic-info' }),
    'persist',
  ],
  states: {
    'applicant-name': {
      on: {
        ...formNextHandler('address')
      },
      meta: {
        path: '/form/basic-info/applicant-name'
      },
      onEntry: [
        () => console.log('enter applicant name'),
        assign({ currentStep: 'applicant-name' })
      ],
      onExit: [
        assign({ previousStep: 'applicant-name' }),
      ]
    },
    address: {
      on: {
        ...formNextHandler('mailing-address-check'),
      },
      meta: {
        path: '/form/basic-info/address'
      },
      onEntry: [
        assign({ currentStep: 'address' })
      ],
      onExit: [
        assign({ previousStep: 'address' })
      ]
    },
    'mailing-address-check': {
      on: {
        '': [
          {
            target: 'mailing-address',
            cond: (context) => hasMailingAddress(context.basicInfo)
          },
          {
            target: 'shortcut',
            cond: (context) => !hasMailingAddress(context.basicInfo)
          },
        ],
      },
    },
    'mailing-address': {
      on: {
        ...formNextHandler('shortcut')
      },
      meta: {
        path: '/form/basic-info/mailing-address',
      },
      onEntry: [
        assign({ currentStep: 'mailing-address'})
      ],
      onExit: [
        assign({ previousStep: 'mailing-address' })
      ],
    },
    shortcut: {
      on: {
        EXIT: {
          target: '#submit',
        },
        ...formNextHandler('#identity'),
      },
      meta: {
        path: '/form/basic-info/shortcut'
      },
      onEntry: [
        assign({ currentStep: 'shortcut' })
      ],
      onExit: [
        assign({ previousStep: 'shortcut'})
      ]
    }
  },
};

const identityChart = {
  id: 'identity',
  initial: 'personal-info',
  onEntry: [
    assign({
      currentSection: 'identity',
      step: 2,
    })
  ],
  onExit: [
    assign({ previousSection: 'identity' }),
  ],
  states: {
    'personal-info': {
      onEntry: [
        assign({ currentStep: 'personal-info' })
      ],
      onExit: [
        assign({ previousStep: 'personal-info' })
      ],
      on: {
        ...formNextHandler('#household')
      },
      meta: {
        path: '/form/identity/personal-info',
      },
    },
  }
};

const householdChart = {
  id: 'household',
  initial: 'how-many',
  onEntry: [
    assign({
      currentSection: 'household',
      step: 3,
    })
  ],
  onExit: [
    assign({ previousSection: 'household' }),
  ],
  strict: true,
  states: {
    'how-many': {
      on: {
        ...formNextHandler('member-info-branch')
      },
      meta: {
        path: '/form/household/how-many',
      },
      onEntry: [
        assign({ currentStep: 'how-many' }),
        'persist'
      ],
      onExit: [
        assign({ previousStep: 'how-many' }),
        'persist'
      ],
    },
    'member-info-branch': {
      on: {
        '': [
          {
            target: 'member-names',
            cond: (context) => {
              return getHouseholdCount(context.household) > 1;
            }
          },
          {
            target: 'food-assistance',
            cond: (context) => {
              return getHouseholdCount(context.household) === 1;
            }
          },
        ],
      },
    },
    'member-names': {
      onEntry: [
        assign({ currentStep: 'member-names' }),
        'persist',
      ],
      onExit: [
        assign({ previousStep: 'member-names' }),
        'persist',
      ],
      on: {
        ...formNextHandler('get-prepared')
      },
      meta: {
        path: '/form/household/member-names',
      }
    },
    'get-prepared': {
      onEntry: [
        assign({ currentStep: 'get-prepared' }),
        'persist',
      ],
      onExit: [
        assign({ previousStep: 'get-prepared' }),
        'persist',
      ],
      on: {
        ...formNextHandler('member-details')
      },
      meta: {
        path: '/form/household/get-prepared',
      }
    },
    'member-details': {
      onEntry: [
        assign({ currentStep: 'member-details' })
      ],
      onExit: [
        assign({ previousStep: 'member-details'})
      ],
      on: {
        ...formNextHandler('member-details-loop')
      },
      meta: {
        path: '/form/household/member-details',
      }
    },
    'member-details-loop': {
      on: {
        '': [
          {
            target: 'member-details',
            cond: (context) => hasAdditionalMembers(context.household),
          },
          {
            target: 'food-assistance',
            cond: (context) => !hasAdditionalMembers(context.household),
          }
        ],
      },
    },
    'food-assistance': {
      onEntry: [
        assign({ currentStep: 'food-assistance' })
      ],
      onExit: [
        assign({ previousStep: 'food-assistance' })
      ],
      meta: {
        path: '/form/household/food-assistance'
      },
      on: {
        ...formNextHandler('#impact')
      }
    }
  }
};

const impactChart = {
  id: 'impact',
  initial: 'adverse-effects',
  onEntry: [
    assign({
      currentSection: 'impact',
      step: 4,
    })
  ],
  onExit: [
    assign({ previousSection: 'impact' }),
  ],
  strict: true,
  states: {
    'adverse-effects': {
      onEntry: [
        assign({ currentStep: 'adverse-effects' }),
      ],
      onExit: [
        assign({ previousStep: 'adverse-effects' }),
      ],
      meta: {
        path: '/form/impact/adverse-effects'
      },
      on: {
        ...formNextHandler('#resources'),
      },
    }
  }
};

const resourcesChart = {
  id: 'resources',
  initial: 'assets',
  internal: true,
  strict: true,
  onEntry: [
    assign({
      currentSection: 'resources',
      step: 5,
    })
  ],
  onExit: [
    assign({ previousSection: 'resources' }),
  ],
  states: {
    assets: {
      internal: true,
      onEntry: [
        assign({ currentStep: 'assets' }),
      ],
      onExit: [
        assign({ previousStep: 'assets' }),
      ],
      meta: {
        path: '/form/resources/assets'
      },
      on: {
        ...formNextHandler('income-branch'),
      },
    },
    'income-branch': {
      on: {
        '': [
          {
            target: '#review',
            cond: (context) => {
              return !context.resources.membersWithIncome.length;
            }
          },
          {
            target: 'income',
            cond: (context) => {
              console.log('in income branch')
              return context.resources.membersWithIncome.length;
            }
          }
        ]
      }
    },
    income: {
      internal: true,
      onEntry: assign({ currentStep: 'income' }),
      onExit: [
        assign({ previousStep: 'income' }),
      ],
      meta: {
        path: '/form/resources/income'
      },
      on: {
        ...formNextHandler('jobs-branch'),
      }
    },
    'jobs-branch': {
      on: {
        '': [
          {
            target: 'jobs',
            cond: (context) => {
              /**
               * Determine whether or not the state machine should transition back to the
               * `job` info screen.
               */
              console.log('jobs guard?')
              const memberId = context.resources.membersWithIncome[0];
              const member = getMembers(context.household)[memberId];
  
              return member && hasJob(member);
            },
          },
          {
            target: 'income-branch',
            cond: (context) => {
              console.log('income branch guard?')
              const memberId = context.resources.membersWithIncome[0];
              const member = getMembers(context.household)[memberId];

              return !member || !hasJob(member);
            },
          }
        ]
      }
    },
    jobs: {
      onEntry: assign({
        currentStep: 'jobs',
        household: (ctx) => {
          // TODO: move this logic into a method and import it
          const { household, resources } = ctx
          const memberIndex = resources.membersWithIncome[0] || 0;
          const member = household.members[memberIndex];
          const nextMember = {
            ...member,
            hasOtherJobs: member.assetsAndIncome.jobs.length ? false : null,
            assetsAndIncome: {
              ...member.assetsAndIncome,
              jobs: member.assetsAndIncome.jobs.concat([job()]),
            }
          };

          const nextHousehold = updateMemberAtIndex(household, memberIndex, nextMember);

          return nextHousehold;
        }
      }),
      onExit: assign({ previousStep: 'jobs' }),
      meta: {
        path: '/form/resources/jobs'
      },
      on: {
        ...formNextHandler('other-jobs-loop')
      }
    },
    'other-jobs-loop': {
      onExit: assign({ previousStep: 'other-jobs-loop' }),
      on: {
        '': [
          {
            target: 'jobs',
            cond: (context) => {
              const memberId = context.resources.membersWithIncome[0];
              const member = getMembers(context.household)[memberId];

              return member && hasOtherJobs(member);
            }
          },
          {
            target: 'income-branch',
            cond: (context) => {
              const memberId = context.resources.membersWithIncome[0];
              const member = getMembers(context.household)[memberId];

              return !member || !hasOtherJobs(member);
            },
          }
        ]
      }
    }
  }
};

const submitChart = {
  id: 'submit',
  initial: 'sign-and-submit',
  onEntry: assign({
    currentSection: 'submit',
    currentStep: 'sign-and-submit',
  }),
  states: {
    'sign-and-submit': {
      on: {
        ...formNextHandler('finalize')
      },
      meta: {
        path: '/form/submit/sign-and-submit'
      }
    },
    finalize: {
      invoke: {
        id: 'submitApplication',
        src: (ctx) => {
          let results = {
            registration: {}
          };

          return createRegistration(ctx)
            .then((data) => {
              results.registration = {
                id: data.id,
                createdAt: data.created_date,
                updatedAt: data.modified_date,
              };

              return createEligibility(data.original_data);
            })
            .then((eData) => {
              results.registration = {
                ...results.registration,
                eligible: eData.eligible
              };

              return Promise.resolve(results);
            });
        },
        onDone: {
          target: '#next-steps',
          actions: [
            assign({
              errors: () => ({ server: false }),
              registration: (_, event) => ({
                ...event.data.registration
              })
            }),
            (ctx) => localStorage.removeItem(STATE_KEY),
          ]
        },
        onError: {
          target: 'sign-and-submit',
          actions: [
            assign({
              errors: () => ({
                server: true
              })
            })
          ]
        }
      },
    },
  }
};

const preRegistrationChart = {
  id: 'pre-registration',
  internal: true,
  initial: 'loading',
  strict: true,
  onEntry: [ 'persist' ],
  onExit: [
    assign({ previousSection: 'pre-registration' }),
    'persist',
  ],
  states: {
    loading: {
      onEntry: assign({ meta: (context) => ({
        ...context.meta,
        loading: true
      })}),
      invoke: {
        id: 'getDisasters',
        src: () => getDisasters(),
        onError: {
          target: 'set-up',
          actions: [
            assign({
              errors: () => ({
                server: true
              }),
              meta: (context) => ({
                ...context.meta,
                loading: false
              }),
              disasters: disaster(),
            })
          ]
        },
        onDone: {
          target: 'set-up',
          actions: [
            assign({
              errors: () => ({ server: false }),
              disasters: (_, event) => {
                return {
                  data: event.data.reduce((memo, disaster) => {
                    return {
                      ...memo,
                      [disaster.id]: disaster
                    }
                  }, {})
                };
              },
              meta: (context) => ({
                ...context.meta,
                loading: false
              })
            })
          ]
        },
      }
    },
    'set-up': {
      onEntry:
        assign({
          currentSection: 'pre-registration',
          currentStep: ''
        }),
      meta: {
        path: '/form/pre-registration'
      },
      on: {
        ...formNextHandler('#get-prepared')
      } 
    }
  },
};

const reviewChart = {
  id: 'review',
  initial: 'default',
  strict: true,
  onEntry: assign({
    currentSection: 'review',
    currentStep: 'review',
    step: 6
  }),
  onExit: assign({
    previousSection: 'review',
    previousStep: 'review'
  }),
  states: {
    default: {
      meta: {
        path: '/form/review'
      },
      on: {
        ...formNextHandler('#submit'),
        EDIT: 'edit'
      }
    },
    edit: {
      internal: true,
      onEntry: [
        () => console.log('executing edit actions'),
        'persist',
        assign((_, event) => {
          const { type, ...rest } = event;

          return {
            ...rest
          };
        })
      ],
      on: {
        ...formNextHandler('#submit'),
      }
    },
  }
};

const welcomeChart = {
  id: 'welcome',
  internal: true,
  strict: true,
  initial: 'welcome',
  onEntry: [
    assign({
      currentSection: 'welcome',
      currentStep: ''
    }),
    'persist',
  ],
  onExit: [
    assign({ previousSection: 'welcome' }),
    'persist'
  ],
  states: {
    welcome: {
      meta: {
        path: '/welcome'
      },
      on: {
        ...formNextHandler('#form')
      }
    }
  }
};

const formStateConfig = {
  id: 'form',
  strict: true,
  internal: true,
  initial: 'pre-registration',
  onEntry: [
    assign({ prefix: 'form' }),
  ],
  onExit: assign({ prefix: '' }),
  states: {
    'pre-registration': preRegistrationChart,
    'get-prepared': {
      id: 'get-prepared',
      internal: true,
      strict: true,
      onEntry: assign({ currentSection: 'get-prepared', currentStep: '' }),
      onExit: assign({ previousSection: 'get-prepared', previousStep: '' }),
      meta: {
        path: '/form/get-prepared'
      },
      on: {
        ...formNextHandler('#basic-info')
      }
    },
    'basic-info': basicInfoChart,
    identity: identityChart,
    household: householdChart,
    impact: impactChart,
    resources: resourcesChart,
    review: reviewChart,
    submit: submitChart,
    'next-steps': {
      id: 'next-steps',
      initial: 'eligibility',
      states: {
        eligibility: {
          on: {
            '': [
              {
                target: 'eligible',
                cond: (context) => {
                  return context.registration.eligible;
                }
              },
              {
                target: 'ineligible',
                cond: (context) => {
                  return !context.registration.eligible;
                }
              }
            ]
          }
        },
        eligible: {
          onEntry: assign({currentStep: 'eligible'}),
          meta: {
            path: '/form/next-steps/eligible'
          }
        },
        ineligible: {
          onEntry: assign({ currentStep: 'ineligible' }),
          meta: {
            path: '/form/next-steps/ineligible',
          }
        }
      }
    },
    finish: {},
    quit: {
      invoke: {
        id: 'clearSessionState',
        src: () =>
          new Promise((resolve) => {
            localStorage.removeItem(STATE_KEY);
            resolve(initialState())
          }),
        onDone: {
          target: '#welcome',
          internal: true,
          actions: [
            assign((_, event) => {
              return { ...event.data }
            })
          ]
        },
      }
    },
  },
  on: {
    QUIT: {
      target: '.quit',
    },
    RESET: {
      target: '.quit'
    }
  }
};

const appChart = {
  initial: 'idle',
  strict: true,
  states: {
    idle: {},
    welcome: welcomeChart,
    form: formStateConfig,
  }
};

const extraActions = {
  persist: (context, {type, ...data}) => {
    const shouldStoreState = context.config.useLocalStorage;

    if (shouldStoreState !== null && !isAffirmative(shouldStoreState)) {
      return;
    }

    const nextState = (() => {
      // we are transitioning through a null state, which doesn't provide
      // data to the state machine. so, write the current context to local storage
      if (!type) {
        return context;
      }

      const overwrites = Object.entries(data)
        .filter(([name, _]) => ignoreKeys.indexOf(name) === -1)
        .reduce((memo, [name, nextData]) => {
          const existingContextSlice = context[name];
          const formattedContextSlice = isPrimitive(existingContextSlice) ?
            nextData : { ...context[name], ...nextData };

          return {
            ...memo,
            [name]: formattedContextSlice,
          }
        }, {});

      return {
        ...context,
        ...overwrites
      };
    })();

    localStorage.setItem(STATE_KEY, JSON.stringify(nextState));
  }
};

export default {
  config: appChart,
  actions: extraActions,
  services: {},
  initialState: initialState(),
};
