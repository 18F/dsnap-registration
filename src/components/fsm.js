import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Machine, matchesState } from 'xstate';
import { getNodes } from 'xstate/lib/graph';
import { interpret } from 'xstate/lib/interpreter'

const MachineContext = React.createContext();
const MachineStateContext = React.createContext();

const formatRouteWithDots = string =>
  string.replace(/\//g, '.').replace(/(^\.|\.$)/g, '');

class FSMRouter extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    routeId: PropTypes.string
  }

  static defaultProps = {
    routeId: 'form'
  }

  routes = null
  machine = null
  service = null
  machineState = null
  historySubscriber = null
  historyTransitioning = false
  stateTransitioning = false

  constructor(props) {
    super(props);

    const { config, actions, services, initialState } = props.config;
    const { on, ...machineConfig } = config;

    const routeNodes = getNodes(Machine(config));

    // Return an object with all the routes in the application
    // where the key/value pair is the meta property `path`, as
    // defined in the state machine config file
    this.routes = routeNodes.reduce((routes, node) => {
      if (node.meta && node.meta.path) {
        // TODO: make `form` key a configurable param / option
        routes[`/${this.props.routeId}${node.meta.path}`] = node.meta.path;
      }

      return routes;
    }, {});

    // Add each available route as an event the state machine can respond to
    const configWithRoutes = {
      ...machineConfig,
      on: {
        ...on,
        ...Object.entries(this.routes).reduce((mapped, [key, value]) => {
          const routeToStatePath = formatRouteWithDots(key);

          return {
            ...mapped,
            [routeToStatePath]: { target: formatRouteWithDots(value) },
          };
        }, {})
      },
    };

    const machine = Machine(configWithRoutes);
    // Create a new xstate state machine with initial state from either localstorage
    // or the default application data
    const machineWithState = machine.withConfig({ actions, services }, { ...initialState });

    this.service = interpret(machineWithState);
    this.machine = machine;
    this.machineState = machine.initialState;
    
    this.service.onTransition(this.handleXStateTransition);
    this.service.start();

    const { context } = this.machineState;

    this.handleHistoryTransition({
      pathname: this.computeURLPathFromContext(context)
    }, true);

    this.historySubscriber = props.history.listen(this.historyHandler);
  }

  usePathForRouting() {
    if (process.env.REACT_APP_DEBUG_PATH && process.env.NODE_ENV === 'development') {
      return true;
     }

     return false;
  }


  computeURLPathFromContext(context) {
    if (this.usePathForRouting()) {
      return this.props.location.pathname;
    }

    const { currentStep, currentSection } = context;
    let path = `/${this.props.routeId}/${currentSection.trim()}`;

    // some sections / paths have the same step, and we don't want
    // to duplicate them, as that leads to an invalid path
    // TODO: this algo needs work; ideally xstate can resolve path issues?
    if (currentStep && currentStep !== currentSection) {
      path += `/${context.currentStep.trim()}`;
    }

    return path;
  };

  componentWillUnmount() {
    this.historySubscriber();
    this.service.stop();
  }

  hasMatchingRoute(maybeRoute) {
    return !!this.routes[maybeRoute];
  }

  historyHandler = (location) => {
    if (this.historyTransitioning) {
      this.historyTransitioning = false;
      return;
    }

    this.handleHistoryTransition(location, true);
  }

  getCurrentNode(state = this.machineState) {
    const path = state.tree.paths[0];

    return this.service.machine.getStateNodeByPath(path);
  }

  handleHistoryTransition = ({ pathname }, debounce = false) => {
    if (this.historyTransitioning) {
      this.historyTransitioning = false;
      return;
    }

    const matchingRoute = this.hasMatchingRoute(pathname);

    if (matchingRoute) {
      const machinePath = formatRouteWithDots(pathname);

      this.stateTransitioning = true;
      this.sendServiceTransition(machinePath);
  
      if (!matchesState(this.machineState, machinePath)) {
        this.stateTransitioning = false;

        if (debounce) {
          this.historyTransitioning = true;
        }

        const currentNode = this.getCurrentNode();
    
        if (currentNode.meta && currentNode.meta.path) {
          this.props.history.replace(`/${this.props.routeId}${currentNode.meta.path}`);
        }
      }
    } else {
      // TODO: we need to handle invalid machine states here
      console.log('No matching route found. this is a bug!')
    }
  }

  handleXStateTransition = (state) => {
    console.log('xstate transition machine state', state);

    this.machineState = state;

    if (this.stateTransitioning) {
      this.stateTransitioning = false;
      return;
    }

    const currentNode = this.getCurrentNode(state);

    if (currentNode.meta && currentNode.meta.path) {
      this.historyTransitioning = true;
      this.props.history.replace(`/${this.props.routeId}${currentNode.meta.path}`);
    }
  }

  sendServiceTransition(path) {
    this.machineState = this.service.send(path);
  }

  transition = ({ command = 'NEXT', data = {} }) => {
    this.machineState = this.service.send({ type: command, ...data });
  }

  render() {
    console.log('fsm render :: machine state', this.machineState)
    return (
      <MachineContext.Provider value={this.transition}>
        <MachineStateContext.Provider value={this.machineState.context}>
          { this.props.children }
        </MachineStateContext.Provider>
      </MachineContext.Provider>
    )
  }
}


export const withMachineContext = (Component) =>
  class extends React.Component {
    render() {
      return (
        <MachineContext.Consumer>
          {(transition) => (
            <Component {...this.props} fsmTransition={transition} />
          )}
        </MachineContext.Consumer>
      );
    }
  }
export const MachineConsumer = MachineContext.Consumer
export const MachineState = MachineStateContext.Consumer;
export default withRouter(FSMRouter);
