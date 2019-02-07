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

    const routeNodes = getNodes(Machine(props.config));

    this.routes = routeNodes.reduce((routes, node) => {
      if (node.meta && node.meta.path) {
        // TODO: make `form` key a configurable param / option
        routes[`/form${node.meta.path}`] = node.meta.path;
      }

      return routes;
    }, {});

    const configWithRoutes = {
      ...props.config,
      on: {
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
    
    this.service = interpret(machine);
    this.machine = machine;
    this.machineState = machine.initialState;
    this.service.start();

    this.handleHistoryTransition(props.location);
    this.historySubscriber = props.history.listen(this.handleHistoryTransition);
  }

  componentWillUnmount() {
    this.historySubscriber();
  }

  hasMatchingRoute(maybeRoute) {
    return !!this.routes[maybeRoute];
  }

  handleHistoryTransition = ({ pathname }) => {
    if (this.hasMatchingRoute(pathname)) {
      const machinePath = formatRouteWithDots(pathname);
      console.log('entering handle history transition to', machinePath)

      this.machineState = this.service.send(machinePath);
    }
  }

  transition = ({ command = 'NEXT', data = {} }) => {
    this.machineState = this.machine.transition(this.machineState, command, data);
    
    const path = this.machineState.tree.paths[0];
    const currentNode = this.service.machine.getStateNodeByPath(path);

    if (currentNode.meta && currentNode.meta.path) {
      console.log('xstate trans moving to ', currentNode.meta.path)
      this.props.history.push(`/form${currentNode.meta.path}`);
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
