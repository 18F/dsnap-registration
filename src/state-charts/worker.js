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
  initial: 'search',
  strict: true,
  states: {    
    search: {
      meta: {
        path: '/search'
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
  },
  on: {
    SEARCH: {
      target: '.loading',
    }
  }
};

export default {
  config: workerChart,
  initialState: initialState()
};
