import { actions, assign } from 'xstate';
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
    currentSection: '',
    currentStep: '',
    previousStep: '',
    previousSection: '',
  }
};

const formNextHandler = target => ({
  NEXT: {
    target,
    actions: [
      () => console.log(`transitioning to next step ${target}`),
      'persist'
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
    (ctx) => { return assign({ ...ctx, currentSection: 'basicInfo' }); }
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
        (ctx) => assign({ ...ctx, currentStep: 'applicantName'})
      ],
      onExit: [
        (ctx) => assign({ ...ctx, previousStep: 'applicantName' })
      ]
    },
    address: {
      on: {
        ...formNextHandler('mailing-address-branch'),
      },
      meta: {
        path: '/basic-info/address'
      },
      onEntry: [
        () => console.log('entered address'),
        assign((ctx) => ({ ...ctx, currentStep: 'residenceAddress' }))
      ],
      onExit: [
        assign((ctx) => ({ ...ctx, previousStep: 'residenceAddress' })),
        (context) => console.log('heylllooo', context)
      ]
    },
    'mailing-address-branch': {
      on: {
        '': [
          { target: 'mailing-address', cond: (context) => {
            debugger
            return !context.basicInfo.currentMailingAddress;
          }},
          { target: 'shortcut', cond: (context) => {
            return context.basicInfo.currentMailingAddress;
          }},
        ],
      },
      onEntry: (context, event) => console.log('ENTER TRANSITION STATE', context, event)
    },
    'mailing-address': {
      on: {
        NEXT: {
          target: 'shortcut',
          actions: log(
            (ctx, event) => console.log(ctx)
          )
        }
      },
      meta: {
        path: '/basic-info/mailing-address',
      },
      onEntry: () => console.log('entered mailAddress')
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
      onEntry: () => console.log('entered offramp')
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
  onEntry: [
    'initialize'
  ],
  initial: 'basic-info',
  states: {
    'basic-info': basicInfoState,
    identity: identityState,
    household: {

    },
    adverse: {

    },
    resources: {

    },
    review: {

    },
    submit: {
      onEntry: [() => console.log('entered submit')]   
    },
    quit: {
      invoke: {
        id: 'clearSessionState',
        src: () => new Promise((resolve) => {
          resolve(localStorage.removeItem(STATE_KEY));
        }),
        onDone: {
          target: 'basic-info',
          actions: 'initialize',
        }
      }
    }
  },
  on: {
    QUIT: '.quit',
  },
};

const extraActions = {
  initialize: () => {
    assign(initialState());
  },
  persist: (context, { type, ...data }) => {
    debugger
    const nextState = {
      ...context,
      ...(data || {}),
    };

    localStorage.setItem(STATE_KEY, JSON.stringify(nextState));
    assign((ctx) => ({...ctx, ...nextState}));
  }
};

export default {
  config: formStateConfig,
  actions: extraActions,
  initialState: initialState(),
};
