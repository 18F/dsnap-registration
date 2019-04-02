import { actions, assign } from 'xstate';
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
  updateMemberAtIndex
} from 'models/household';
import { hasJob, hasOtherJobs } from 'models/person';
import { getDisasters } from 'services/disaster';
import { createRegistration } from 'services/registration';
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
    currentSection: 'pre-registration',
    currentStep: '',
    previousStep: '',
    previousSection: '',
    errors: '',
    /**
     * totalSteps refers to the number of sections a user will move through
     * while filling out the form. It doesn't necessarily reflect
     * the number of states the machine can be in.
     * 
     * For example, the `quit` state is used internally by the state machine
     * but is not exposed to the user. Therefore, it is not included in the total
     * number of steps
     */
    disasters: disaster(),
    meta: {
      loading: undefined
    },
    config: config(),
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
  initial: 'applicant-name',
  onEntry: [
    assign({
      currentSection: 'basic-info',
      step: 1,
    })
  ],
  onExit: [
    assign({ previousSection: 'basic-info' }),
  ],
  states: {
    'applicant-name': {
      on: {
        ...formNextHandler('address')
      },
      meta: {
        path: '/basic-info/applicant-name'
      },
      onEntry: [
        assign({ currentStep: 'applicant-name', previousStep: '' })
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
        path: '/basic-info/address'
      },
      onEntry: [
        assign({ currentStep: 'address' })
      ],
      onExit: [
        assign({ previousStep: 'address' }),
        (context) => actions.send({ type: 'NEXT', ...context })
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
        path: '/basic-info/mailing-address',
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
        path: '/basic-info/shortcut'
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
        path: '/identity/personal-info',
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
        path: '/household/how-many',
      },
      onEntry: [
        assign({ currentStep: 'how-many' })
      ],
      onExit: [
        assign({ previousStep: 'how-many' }),
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
        assign({ currentStep: 'member-names' })
      ],
      onExit: [
        assign({ previousStep: 'member-names' })
      ],
      on: {
        ...formNextHandler('get-prepared')
      },
      meta: {
        path: '/household/member-names',
      }
    },
    'get-prepared': {
      onEntry: [
        assign({ currentStep: 'get-prepared' })
      ],
      onExit: [
        assign({ previousStep: 'get-prepared' })
      ],
      on: {
        ...formNextHandler('member-details')
      },
      meta: {
        path: '/household/get-prepared',
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
        path: '/household/member-details',
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
        path: '/household/food-assistance'
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
        path: '/impact/adverse-effects'
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
        path: '/resources/assets'
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
        path: '/resources/income'
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
        path: '/resources/jobs'
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
  onEntry: assign({ currentSection: 'sign-and-submit' }),
  states: {
    'sign-and-submit': {
      on: {
        ...formNextHandler('finalize')
      },
      meta: {
        path: '/submit/sign-and-submit'
      }
    },
    finalize: {
      invoke: {
        id: 'submitApplication',
        src: (ctx) => {
          return createRegistration(ctx);
        },
        onDone: {
          target: '#next-steps',
          actions: [
            assign({
              submitStatus: () => ({
                eligible: true
              }),
              registration: (_, event) => ({
                id: event.data.id,
                createdAt: event.data.created_date,
                updatedAt: event.data.modified_date,
                data: event.data.latest_data
              })
            }),
            (ctx) => localStorage.setItem(STATE_KEY, JSON.stringify(ctx))
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
    onEntry: [
      () => console.log('enter prereg'),
      assign({
        currentSection: 'pre-registration',
        currentStep: ''
      }),
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
               disasters: (_, event) => {
                 return {
                   data: event.data.reduce((memo, d) => {
                      return {
                        ...memo,
                        [d.id]: d
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
        meta: {
          path: '/pre-registration'
        },
        on: {
          ...formNextHandler('#prepare')
        }
      }
    }
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
        path: '/review'
      },
      on: {
        ...formNextHandler('#submit'),
      }
    }
  }
};


const formStateConfig = {
  id: 'form',
  strict: true,
  internal: true,
  initial: 'idle',
  states: {
    idle: {
      onEntry: () => console.log('enter idle'),
    },
    'pre-registration': preRegistrationChart,
    prepare: {
      id: 'prepare',
      initial: 'default',
      states: {
        default: {
          onEntry: assign({ currentStep: 'prepare' }),
          onExit: assign({ previousStep: 'prepare' }),
          meta: {
            path: '/get-prepared'
          },
          on: {
            NEXT: 'basic-info'
          }
        }
      },
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
                  return context.submitStatus.eligible;
                }
              },
              {
                target: 'ineligible',
                cond: (context) => {
                  return !context.submitStatus.eligible;
                }
              }
            ]
          }
        },
        eligible: {
          onEntry: assign({currentStep: 'eligible'}),
          meta: {
            path: '/next-steps/eligible'
          }
        },
        ineligible: {
          onEntry: assign({ currentStep: 'ineligible' }),
          meta: {
            path: '/next-steps/ineligible',
          }
        }
      }
    },
    finish: {},
    quit: {
      invoke: {
        id: 'clearSessionState',
        src: () => new Promise((resolve) => {
          localStorage.removeItem(STATE_KEY);
          resolve(initialState())
        }),
        onDone: {
          target: 'pre-registration',
          internal: true,
          actions: [
            assign((_, event) => {
              return { ...event.data }
            })
          ]
        },
      }
    },
    edit: {
      internal: true,
      onEntry: [
        () => console.log('executing actions'),
        'persist',
        assign((_, event) => {
          const { type, ...rest } = event;

          return {
            ...rest
          };
        })
      ],
    }
  },
  on: {
    QUIT: {
      target: '.quit',
    },
    EDIT: {
      target: '.edit'
    }
  }
};

const extraActions = {
  persist: (context, {type, ...data}) => {
    if (!isAffirmative(context.config.useLocalStorage)) {
      return;
    }

    const nextState = (() => {
      // we are transitioning through a null state, which doesn't provide
      // data to the state machine. so, just write the current context to local storage
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
  config: formStateConfig,
  actions: extraActions,
  services: {},
  initialState: initialState(),
};
