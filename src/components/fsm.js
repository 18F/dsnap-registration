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
    usePath: PropTypes.bool,
  }

  static defaultProps = {
    usePath: false,
  }

  mounted = false
  routes = null
  machine = null
  service = null
  machineState = null
  historySubscriber = null
  historyTransitioning = false
  stateTransitioning = false

  state = {
    machineState: null,
    history: []
  }

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
        routes[node.meta.path] = node.meta.path;
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
    this.machine = this.service.machine;
    this.machineState = this.machine.initialState;
    this.service.start();
    this.service.onTransition(this.handleXStateTransition);

    this.handleHistoryTransition({
      pathname: this.computeURLPathFromContext(this.machineState.context)
    }, null, false);

    this.historySubscriber = props.history.listen(this.handleHistoryTransition);
    
  }

  getMachineState() {
    if (!this.state.machineState) {
      return this.machineState;
    }

    return this.state.machineState;
  }

  usePathForRouting() {
    if (
      (process.env.REACT_APP_DEBUG_PATH && process.env.NODE_ENV === 'development') ||
      this.props.usePath
    ) {
      return true;
     }

     return false;
  }

  computeURLPathFromContext(context) {
    if (this.usePathForRouting()) {
      return this.props.location.pathname;
    }

    const { currentStep, currentSection, prefix = '' } = context;
    //debugger
    const pathStart = prefix ? `/${prefix}` : prefix;
    let path = `${pathStart}/${currentSection.trim()}`;

    // some sections / paths have the same step, and we don't want
    // to duplicate them, as that leads to an invalid path
    // TODO: this algo needs work; ideally xstate can resolve path issues?
    if (currentStep && currentStep !== currentSection) {
      path += `/${context.currentStep.trim()}`;
    }

    return path;
  };

  componentDidMount() {
    this.mounted = true;
    this.setState({ machineState: this.machineState });
  }

  componentWillUnmount() {    
    this.historySubscriber();
    this.service.stop();
  }

  updateComponentHistory(route) {
    this.setState({
      history: [...this.state.history, route]
    }, () => console.log('routes visited', this.state.history));
  }

  hasMatchingRoute(maybeRoute) {
    return !!this.routes[maybeRoute];
  }

  getCurrentNode(machineState) {
    const state = machineState || this.getMachineState();
    const path = state.tree.paths[0];

    return this.service.machine.getStateNodeByPath(path);
  }

  handleHistoryTransition = ({ pathname }, _, debounce = true) => {
    debugger
    if (this.historyTransitioning) {
      this.historyTransitioning = false;
      return;
    }

    const matchingRoute = this.hasMatchingRoute(pathname);

    if (matchingRoute) {
      const machinePath = formatRouteWithDots(pathname);

      this.stateTransitioning = true;
      this.sendServiceTransition(machinePath);
     // debugger
      if (!matchesState(this.getMachineState(), machinePath)) {
        debugger
        this.stateTransitioning = false;

        const currentNode = this.getCurrentNode();
    
        if (currentNode.meta && currentNode.meta.path) {
          if (debounce) {
            this.historyTransitioning = true;
          }
          
          this.updateComponentHistory(`${currentNode.meta.path}`);

          this.props.history.push(`${currentNode.meta.path}`);
        }
      } else {
        debugger
      }
    } else {
      // TODO: handle invalid machine states here?
    }
  }

  handleXStateTransition = (state) => {
    debugger
    if (this.mounted) {
      this.setState({ machineState: state })
    } else {
      this.machineState = state
    }

    if (this.stateTransitioning) {
      this.stateTransitioning = false;
      return;
    }

    const currentNode = this.getCurrentNode(state);

    if (currentNode.meta && currentNode.meta.path) {
      this.historyTransitioning = true;

      this.updateComponentHistory(`${currentNode.meta.path}`);

      this.props.history.push(`${currentNode.meta.path}`);
    }
  }

  sendServiceTransition(path) {
    this.service.send(path);
  }

  transition = ({ command = 'NEXT', data = {} }) => {
    this.service.send({ type: command, ...data });
  }

  render() {
    console.log('fsm render :: machine state', this.state.machineState);

    return (
      <MachineContext.Provider value={this.transition}>
        <MachineStateContext.Provider value={this.getMachineState().context}>
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
  };

export const withMachineState = Component =>
  class extends React.Component {
    render() {
      return (
        <MachineStateContext.Consumer>
          {(state) => (
            <Component {...this.props} context={state} />
          )}
        </MachineStateContext.Consumer>
      );
    }
  };

export const MachineConsumer = MachineContext.Consumer
export const MachineState = MachineStateContext.Consumer;
export default withRouter(FSMRouter);
