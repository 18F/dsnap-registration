import { actions, assign, sendParent } from 'xstate';
import modelState from 'models';
const { log } = actions;

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
  }
};

const formNextHandler = target => ({
  NEXT: {
    target,
    internal: true,
    actions: [
      () => console.log(`transitioning to next step ${target}`),
      'persist',
      assign((ctx, event) => {
        return {
          [ctx.currentSection]: (event[ctx.currentSection] || modelState[ctx.currentSection])
        }
      })
    ]
  }
});

// TODO: run validation methods in onEntry hook?
// validations should maybe be their own step? might be useful when
// we need to validate the whole section on?
/**
 * each step has these sequence of states =>
 *  idle => validate => branch(error | idle) ? 
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


const basicInfoState = {
  id: 'basic-info',
  initial: 'applicant-name',
  onEntry: [
    (context) => console.log('entering basic info', context),
    assign({ currentSection: 'basicInfo' })
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
    'mailing-address-branch': {
      onEntry: [
        (context) => actions.send({ type: 'NEXT', ...context })
      ],
      on: {
        NEXT: 'mailing-address-check'
      }
    },
    'mailing-address-check': {
      on: {
        '': [
          { target: 'mailing-address', cond: (context) => {
            return context.basicInfo.currentMailingAddress !== 'true';
          }},
          { target: 'shortcut', cond: (context) => {
            return context.basicInfo.currentMailingAddress === 'true';
          }},
        ],
        NEXT: {
          actions: () => console.log('hi')
        }
      },
    },
    'mailing-address': {
      on: {
        NEXT: {
          target: 'shortcut',
        }
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
          actions: log(
            (ctx, event) => 'offramping'
          )
        },
        NEXT: {
          target: '#identity',
          actions: log(
            (ctx, event) => 'to identity'
          )
        }
      },
      meta: {
        path: '/basic-info/shortcut'
      },
      onEntry: [
        () => console.log('entered offramp'),
        assign({ currentStep: 'offramp' })
      ],
      onExit: [
        assign({ previousStep: 'offramp'})
      ]
    }
  },
};

const identityState = {
  id: 'identity',
  initial: 'personal-info',
  states: {
    'personal-info': {
      on: {
        NEXT: '#household'
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
    const nextState = {
      ...context,
      [context.currentSection]: (data[context.currentSection] || modelState[context.currentSection]),
    };

    console.log('persisting next state', nextState)
    localStorage.setItem(STATE_KEY, JSON.stringify(nextState));
  }
};

export default {
  config: formStateConfig,
  actions: extraActions,
  initialState: initialState(),
};
