import { actions } from 'xstate';
const { log } = actions;

const basicInfoState = {
  initial: 'applicant-name',
  states: {
    'applicant-name': {
      on: {
        NEXT: 'address'
      },
      meta: {
        path: '/basic-info/applicant-name'
      },
    },
    address: {
      on: {
        NEXT: 'unknown' 
      },
      meta: {
        path: '/basic-info/address'
      },
      onEntry: () => console.log('entered address')
    },
    unknown: {
      on: {
        '': [
          { target: 'mailing-address', cond: (context) => {
            return !context.basicInfo.currentMailingAddress;
          }},
          { target: 'shortcut', cond: (context) => {
            return context.basicInfo.currentMailingAddress;
          }},
        ],
      },
      onEntry: () => console.log('ENTER TRANSITION STATE')
    },
    'mailing-address': {
      on: {
        NEXT: {
          target: 'shortcut',
          actions: log(
            (ctx, event) => 'mailAddressing'
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
  }
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
  },
};

const formStateConfig = {
  id: 'form',
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
    }
  }
};

export default formStateConfig;
