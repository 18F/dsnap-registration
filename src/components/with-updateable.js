import React from 'react';
import { connect } from 'formik';
import { withMachineContext } from 'components/fsm';

const withUpdateable = (Component) => {
  class Updateable extends React.Component {
    onUpdate = () => {
      this.props.fsmTransition({
        command: 'EDIT',
        data: {
          ...this.props.formik.values
        }
      });
    }

    render() {
      const { formik, ...rest } = this.props;
 
      return (
        <Component {...rest} handleUpdate={this.onUpdate} formik={formik} />
      );
    }
  }

  return withMachineContext(connect(Updateable));
}

export default withUpdateable;
