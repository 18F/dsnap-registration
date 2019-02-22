import { actions, assign } from 'xstate';
import modelState from 'models';
import { hasMailingAddress } from 'models/basic-info';
import { getHouseholdCount, hasAdditionalMembers } from 'models/household';

const STATE_KEY = 'dsnap-registration';

const currentSectionSelector = context =>
  context.currentModel;

const initialState = () => {
  const machineState = {
    ...modelState,
    currentModel: null,
    currentSection: 'basic-info',
    currentStep: 'applicant-name',
    previousStep: null,
    previousSection: null,
    /**
     * totalSteps refers to the number of sections a user will move through
     * while filling out the form. It doesn't necessarily reflect
     * the number of states the machine can be in.
     * 
     * For example, the `quit` state is used internally by the state machine
     * but is not exposed to the user. Therefore, it is not included in the total
     * number of steps
     */
    totalSteps: 4,
  };
  let state;

  try {
    state = JSON.parse(localStorage.getItem(STATE_KEY)) || machineState;
  } catch(error) {
    state = machineState;
  }

  return state;
};

const formNextHandler = target => ({
  NEXT: {
    target,
    internal: true,
    actions: [
      () => console.log(`transitioning to next step ${target}`),
      'persist',
      // open question: why doesnt xstate persist the context when an
      // assign call is made within another function?
      assign((ctx, event) => {
        const section = currentSectionSelector(ctx);

        return {
          [section]: (event[section] || modelState[section])
        };
      })
    ]
  }
});

const basicInfoChart = {
  id: 'basic-info',
  initial: 'applicant-name',
  onEntry: [
    assign({
      currentSection: 'basic-info',
      currentModel: 'basicInfo',
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
        assign({ currentStep: 'applicant-name', previousStep: null })
      ],
      onExit: [
        assign({ previousStep: 'applicant-name' })
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
      currentModel: 'identity',
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
      currentModel: 'household',
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
        (context) => actions.send({ type: 'NEXT', ...context })
      ],
    },
    'member-info-branch': {
      on: {
        '': [
          {
            target: 'member-names',
            cond: (context) => {
              return Number(getHouseholdCount(context.household));
            }
          },
          {
            target: '#impact',
            cond: (context) => {
              return !Number(getHouseholdCount(context.household));
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
      currentModel: 'impact',
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
        () => console.log('entered adverse'),
        assign({ currentStep: 'adverse-effects' }),
      ],
      onExit: assign({ previousStep: 'adverse-effects' }),
      meta: {
        path: '/impact'
      }
    }
  }
};


const formStateConfig = {
  id: 'form',
  internal: true,
  strict: true,
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
    resources: {},
    review: {},
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

      const overwrites = Object.entries(data).reduce((memo, [name, nextData]) => {
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
