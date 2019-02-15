import { actions, assign } from 'xstate';
import modelState from 'models';

const STATE_KEY = 'dsnap-registration';

const initialState = () => {
  let models; 

  try {
    models = JSON.parse(localStorage.getItem(STATE_KEY)) || modelState;
  } catch(error) {
    models = modelState;
  }

  return {
    ...models,
    currentSection: null,
    currentStep: null,
    previousStep: null,
    previousSection: null,
    /**
     * totalSteps refers to the number of sections a user will move through
     * while filling out the form. It doesn't necessarily reflect
     * the number of states the machine can be in.
     * 
     * For example, the `quit` state is used internally by the state machine
     * but is not exposed to the user, and therefore not included in the total
     * number of steps
     */
    totalSteps: 2,
  }
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
      assign((ctx, event) => ({
        [ctx.currentSection]: (event[ctx.currentSection] || modelState[ctx.currentSection])
      }))
    ]
  }
});

// TODO: run validation methods in onEntry hook?
// validations should maybe be their own state? might be useful when
// we need to validate the whole section on?
/**
 * each step has these sequence of states =>
 *  idle => validate => branch(error | idle) ? 
 *
 */


// we only need to do it when state is dirty
// probably want to store meta information of what steps are 'done'

// need actor factory for step / section? probably need to flesh out a section
// more completely to see where abstractions can be made
// const Actor = (xstateConfigs) => {
//   const { onEntry, on, id, initial, states, ...rest } = xstateConfigs;

//   return {
//     id,
//     initial,
//     onEntry: [
//       ...onEntry,
//       assign({ currentSection: id })
//     ],
//     on: { ...on },
//     states: { ...states },
//     ...rest
//   };
// };

// start user at last filled in step!!!!! thanks aaron


const basicInfoState = {
  id: 'basic-info',
  initial: 'applicant-name',
  onEntry: [
    (context) => console.log('entering basic info', context),
    assign({
      currentSection: 'basicInfo',
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
        assign({ currentStep: 'applicantName', previousStep: null })
      ],
      onExit: [
        assign({ previousStep: 'applicantName' })
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
        assign({ currentStep: 'residenceAddress' })
      ],
      onExit: [
        assign({ previousStep: 'residenceAddress' }),
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
        assign({ currentStep: 'mailing-address '})
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

const identityState = {
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
        assign({ currentStep: 'personalInfo' })
      ],
      onExit: [
        assign({ previousStep: 'personalInfo' })
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


const formStateConfig = {
  strict: true,
  id: 'form',
  context: {
    ...initialState()
  },
  initial: 'basic-info',
  states: {
    'basic-info': basicInfoState,
    identity: identityState,
    household: {
      id: 'household'
    },
    adverse: {},
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

      return {
        ...context,
        [context.currentSection]: (data[context.currentSection] || modelState[context.currentSection]),
      };
    })();

    console.log('persisting next state', nextState)
    localStorage.setItem(STATE_KEY, JSON.stringify(nextState));
  }
};

export default {
  config: formStateConfig,
  actions: extraActions,
  initialState: initialState(),
};
