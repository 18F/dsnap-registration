import { assign } from 'xstate';
import { getRegistrations } from 'services/registration';
import { createEligibility } from 'services/eligibility';

const STORAGE_KEY = 'worker-state';

const initialState = () => {
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const { eligibility, currentRegistration } = savedState;

  return {
    registrations: [],
    currentRegistration: currentRegistration || null,
    eligibility: eligibility || null,
    errors: '',
    meta: {
      loading: false
    },
  };
}

const workerChart = {
  id: 'worker',
  key: 'worker',
  initial: 'idle',
  strict: true,
  states: {
    idle: {},
    worker: {
      initial: 'idle',
      states: {
        idle: {},
        search: {
          onEntry: () => {
            localStorage.removeItem(STORAGE_KEY)
          },
          meta: {
            path: '/worker/search'
          }
        },
        loading: {
          onEntry: assign({
            meta: { loading: true }
          }),
          invoke: {
            id: 'doSearch',
            src: (_, { type, ...searchParams }) => {
              return getRegistrations(searchParams);
            },
            onDone: {
              target: 'loaded',
              actions: [
                assign({
                  registrations: (_, data) => data.data,
                  meta: { loading: false }
                }),
              ]
            },
            onError: {
              target: 'loaded',
            }
          }
        },
        loaded: {
          internal: true,
        },
        'check-eligibility': {
          onEntry: assign({ meta: { loading: true }}),
          invoke: {
            id: 'checkEligibility',
            src: (ctx, _) => {
              const registration = ctx.registrations[ctx.currentRegistration].server;
              return createEligibility(registration);
            },
            onError: {
              actions: () => console.log('error?')
            },
            onDone: {
              target: '#review',
              actions: [
                assign({
                  eligibility: (_, data) => data.data,
                  meta: { loading: false }
                }),
                (_, event) => {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}),
                    eligibility: event.data
                  }))
                }
              ]
            }
          }
        },
        review: {
          id:'review',
          meta: {
            path: '/worker/review'
          },
        }
      }
    },
  },
  on: {
    SEARCH: {
      target: 'worker.loading'
    },
    SELECT_REGISTRATION: {
      target: 'worker.check-eligibility',
      actions: [
        assign({ currentRegistration: (ctx, data) =>
          ctx.registrations[data.registrationId]
        }),
        (ctx, event) => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}),
            currentRegistration: ctx.registrations[event.registrationId]
          }))
        }
      ]
    }
  }
};

export default {
  config: workerChart,
  initialState: initialState()
};
