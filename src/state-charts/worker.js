import { assign } from 'xstate';
import { getRegistrations, updateRegistration } from 'services/registration';
import { createEligibility } from 'services/eligibility';
import { fromRegistrationServiceFormat } from 'utils/json-transform';

const STORAGE_KEY = 'worker-state';

const formatRegistrations = (data) => {
  const registrations = Array.isArray(data) ? data : [data];
  return registrations.map(({ id, latest_data }) => {
    return {
      server: latest_data,
      client: fromRegistrationServiceFormat(id, latest_data)
    }
  });
};

const initialState = () => {
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  const { eligibility, currentRegistration, disasters } = savedState;

  return {
    registrations: [],
    currentRegistration: currentRegistration || null,
    eligibility: eligibility || null,
    errors: '',
    meta: {
      loading: false
    },
    disasters: disasters || null
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
            id: 'search',
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
            src: (ctx) => {
              const registration = ctx.currentRegistration.server;
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
                  meta: { loading: false },
                  disasters: (ctx, event) => {
                    return {
                      data: {
                        [ctx.currentRegistration.server.disaster_id]: { state: event.data.state }
                      }
                    }
                  }
                }),
                (ctx, event) => {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}),
                    eligibility: event.data,
                    disasters: ctx.disasters,
                  }))
                }
              ]
            }
          }
        },
        'update-registration': {
          invoke: {
            id: 'updateRegistration',
            src: (_, { type, ...rest }) => {
              return updateRegistration(rest);
            },
            onDone: {
              target: 'check-eligibility',
              actions: [
                assign({
                  currentRegistration: (_, event) => event.data
                })
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
        assign({
          currentRegistration: (ctx, data) => {
            return ctx.registrations[data.registrationId];
          }
        }),
        (ctx, event) => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}),
            currentRegistration: ctx.registrations[event.registrationId]
          }))
        }
      ]
    },
    EDIT: {
      target: 'worker.update-registration',
      actions: [
        assign({
          currentRegistration: (ctx, event) => ({
            client: {
              ...ctx.currentRegistration.client,
              impact: event.impact,
              household: event.household,
              basicInfo: event.basicInfo
            },
            server: ctx.currentRegistration.server
          })
        }),
        (ctx, _) => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}),
            currentRegistration: ctx.currentRegistration
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
