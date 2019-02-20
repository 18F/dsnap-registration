import { actions, assign } from 'xstate';
import modelState from 'models';
import { getHouseholdCount } from 'models/household';

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
    totalSteps: 3,
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
    (context) => console.log('entering basic info', context),
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
        (context) => console.log('entered applicant-name', context),
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
        () => console.log('entered address'),
        assign({ currentStep: 'address' })
      ],
      onExit: [
        () => console.log('exit address step'),
        assign({ previousStep: 'address' }),
        (context) => actions.send({ type: 'NEXT', ...context })
      ]
    },
    'mailing-address-check': {
      on: {
        '': [
          {
            target: 'mailing-address',
            cond: (context) => {
              return context.basicInfo.currentMailingAddress !== 'true';
            },
          },
          {
            target: 'shortcut',
            cond: (context) => {
              return context.basicInfo.currentMailingAddress === 'true';
            }
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
        () => console.log('entered mailAddress'),
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
        () => console.log('entered offramp'),
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
    () => console.log('houeshold on exit hit?'),
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
            target: '#adverse',
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
        //...formNextHandler('get-prepared')
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
        NEXT: [
          {
            target: 'member-details',
            cond: (context) => context.household.hasAdditionalMembers
          },
          {
            target: '#adverse',
            cond: (context) => !context.household.hasAdditionalMembers
          }
        ],
      },
      meta: {
        path: '/household/member-details',
      }
    }
  }
};


const formStateConfig = {
  strict: true,
  id: 'form',
  context: {
    ...initialState()
  },
  initial: 'idle',
  states: {
    idle: {},
    'basic-info': basicInfoChart,
    identity: identityChart,
    household: householdChart,
    adverse: {
      id: 'adverse',
      onEntry: [() => console.log('entered adverse section')]
    },
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
    }
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

      const section = currentSectionSelector(context);

      return {
        ...context,
        [section]: (data[section] || modelState[section]),
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
