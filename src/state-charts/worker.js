import { assign } from 'xstate';
import modelState from 'models';
import { getRegistrations } from 'services/registration';

const initialState = () => ({
  registrations: [],
  currentRegistration: null,
  errors: '',
  meta: {
    loading: undefined
  },
});

const workerChart = {
  id: 'worker',
  key: 'worker',
  initial: 'idle',
  strict: true,
  states: {
    idle: {},
    worker: {
      states: {
        search: {
          meta: {
            path: '/worker/search'
          }
        },
        loading: {
          invoke: {
            id: 'doSearch',
            src: (_, { type, ...searchParams }) => {
              return getRegistrations(searchParams);
            },
            onDone: {
              target: 'loaded',
              actions: [
                assign({ registrations: (_, data) => data.data })
              ]
            },
            onError: {
              target: 'loaded',
            }
          }
        },
        loaded: {
          internal: true
        },
        review: {
          meta: {
            path: '/worker/review'
          }
        }
      }
    },
  },
  on: {
    SEARCH: {
      target: 'worker.loading'
    },
    SELECT_REGISTRATION: {
      target: 'worker.review',
      actions: assign({ currentRegistration: (_, data) =>
        data.registrationId
      })
    }
  }
};

export default {
  config: workerChart,
  initialState: initialState()
};
