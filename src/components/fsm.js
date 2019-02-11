import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Machine } from 'xstate';
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
    this.historySubscriber = props.history.listen(this.handleHistoryTransition);
  }

  componentDidMount() {
    this.service.start();
    this.handleHistoryTransition(this.props.location);
  }

  componentWillUnmount() {
    this.historySubscriber();
    this.service.stop();
  }

  hasMatchingRoute(maybeRoute) {
    return !!this.routes[maybeRoute];
  }

  handleHistoryTransition = ({ pathname }) => {
    if (this.historyTransitioning) {
      this.historyTransitioning = false;
      return;
    }

    const matchingRoute = this.hasMatchingRoute(pathname);

    if (matchingRoute) {
      this.historyTransitioning = true;
 
      const machinePath = formatRouteWithDots(pathname);

      this.sendServiceTransition(machinePath);
    }
  }
  
  // TODO: abstract this shared funcitonality
  handleXStateTransition = (state) => {
    // TODO: one of more of these guards is redundant
    if (this.historyTransitioning) {
      this.historyTransitioning = false;
      return;
    }

    const path = state.tree.paths[0];
    const currentNode = this.service.machine.getStateNodeByPath(path);

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

    const path = this.machineState.tree.paths[0];
    const currentNode = this.service.machine.getStateNodeByPath(path);

    if (currentNode.meta && currentNode.meta.path) {
      this.props.history.push(`/form${currentNode.meta.path}`);
    } else {
      // trigger a service state update that doesn't correspond with an
      // application route
      this.sendServiceTransition(command);
    }
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
