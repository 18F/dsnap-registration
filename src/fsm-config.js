import { actions, assign } from 'xstate';
import testData from './test-data';
import modelState from 'models';
import { hasMailingAddress } from 'models/basic-info';
import {
  getHouseholdCount,
  getMembers,
  hasAdditionalMembers
} from 'models/household';
import { hasJob, hasOtherJobs } from 'models/person';

const STATE_KEY = 'dsnap-registration';
// ignore these when running the persistence algo, the context is responsible
// for managing the meta state of the machine
const ignoreKeys = ['currentSection', 'currentStep'];


const initialState = () => {
  const loadState = process.env.REACT_APP_LOAD_STATE;
  const stateExists = localStorage.getItem(STATE_KEY);

  if (loadState && !stateExists) {
    localStorage.setItem(STATE_KEY, JSON.stringify(testData));
    return testData;
  }

  const machineState = {
    ...modelState,
    currentSection: 'basic-info',
    currentStep: 'applicant-name',
    previousStep: '',
    previousSection: '',
    /**
     * totalSteps refers to the number of sections a user will move through
     * while filling out the form. It doesn't necessarily reflect
     * the number of states the machine can be in.
     * 
     * For example, the `quit` state is used internally by the state machine
     * but is not exposed to the user. Therefore, it is not included in the total
     * number of steps
     */
    totalSteps: 5,
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
      ...extraActions,
      () => console.log(`transitioning to next step ${target}`),
      'persist',
      // open question: why doesnt xstate persist the context when an
      // assign call is made within another function?
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
  on: {
    INTERNAL_CONTEXT_WRITE: {
      internal: true,
      actions: [
        assign({
          previousStep: 'income',
          resources: (context) => {
            const nextMembers = context.resources.membersWithIncome.slice(1);

            return {
              membersWithIncome: nextMembers
            };
          }
        }),
        'persist'
      ]
    }
  },
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
            target: '#form.review',
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
      onEntry: assign({ currentStep: 'jobs' }),
      onExit: assign({ previousStep: 'jobs' }),
      meta: {
        path: '/resources/jobs'
      },
      on: {
        ...formNextHandler('other-jobs-loop')
      }
    },
    'other-jobs-loop': {
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


const formStateConfig = {
  id: 'form',
  strict: true,
  internal: true,
  context: {
    ...initialState()
  },
  initial: 'idle',
  states: {
    idle: {},
    'basic-info': basicInfoChart,
    identity: identityChart,
    household: householdChart,
    impact: impactChart,
    resources: resourcesChart,
    review: {
      onEntry: [
        () => console.log('review step')
      ]
    },
    submit: {
      onEntry: [() => console.log('entered submit')]   
    },
    quit: {
      invoke: {
        id: 'clearSessionState',
        src: () => new Promise((resolve) => {
          localStorage.removeItem(STATE_KEY);
          resolve(initialState())
        }),
        onDone: {
          target: 'basic-info',
          internal: true,
          actions: [
            assign((_, event) => {
              return { ...event.data }
            })
          ]
        },
      }
    }
  },
  on: {
    QUIT: {
      target: '.quit',
    },
  },
};

const extraActions = {
  persist: (context, {type, ...data}) => {
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
          const formattedContextSlice = typeof existingContextSlice === 'string' ?
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
  initialState: initialState(),
};
