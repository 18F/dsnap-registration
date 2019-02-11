import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Machine, matchesState } from 'xstate';
import { getNodes } from 'xstate/lib/graph';
import { interpret } from 'xstate/lib/interpreter'

const MachineContext = React.createContext();
const MachineStateContext = React.createContext();

const formatRouteWithDots = string =>
  string.replace(/\//g, '.').replace('.', '');

class FSMRouter extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
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

    const { config, actions, initialState } = props.config;
    const { on, ...machineConfig } = config;

    const routeNodes = getNodes(Machine(config));

    this.routes = routeNodes.reduce((routes, node) => {
      if (node.meta && node.meta.path) {
        // TODO: make `form` key a configurable param / option
        routes[`/form${node.meta.path}`] = node.meta.path;
      }

      return routes;
    }, {});

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
    const machineWithState = machine.withConfig({ actions }, { ...initialState });

    this.service = interpret(machineWithState);
    this.machine = machine;
    this.machineState = machine.initialState;
    
    this.service.onTransition(this.handleXStateTransition);
    this.service.start();
    
    this.handleHistoryTransition(this.props.location);
    this.historySubscriber = props.history.listen(this.historyHandler);
  }

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
        if (debounce) {
          this.historyTransitioning = true;
        }

        const currentNode = this.getCurrentNode();
    
        if (currentNode.meta && currentNode.meta.path) {
          this.props.history.replace(`/form${currentNode.meta.path}`);
        }
      }
    }
  }
  
  // TODO: abstract this shared functionality
  handleXStateTransition = (state) => {
    if (this.stateTransitioning) {
      this.stateTransitioning = false;
      return;
    }

    const currentNode = this.getCurrentNode(state);

    if (currentNode.meta && currentNode.meta.path) {
      this.historyTransitioning = true;
      this.props.history.push(`/form${currentNode.meta.path}`);
    }
  }

  sendServiceTransition(path) {
    this.machineState = this.service.send(path);
  }

  transition = ({ command = 'NEXT', data = {} }) => {
    // seems like we need both of these transiition calls to pass data properly,
    // odd
    this.machine.transition(this.machineState, { type: command, ...data }); 
    this.machineState = this.service.send({ type: command, ...data });
  }

  render() {
    return (
      <MachineContext.Provider value={this.transition}>
        <MachineStateContext.Provider value={this.machineState}>
          { this.props.children }
        </MachineStateContext.Provider>
      </MachineContext.Provider>
    )
  }
}

export const MachineState = MachineStateContext.Consumer;
export const MachineConsumer = MachineContext.Consumer
export default withRouter(FSMRouter);