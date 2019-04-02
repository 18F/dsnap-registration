import React from 'react';
import { connect } from 'formik';
import { withMachineContext } from 'components/fsm';

const withUpdateable = (Component) => {
  class Updateable extends React.Component {
    onUpdate = () => {
      const { values, errors, validate } = this.props.formik;

      validate();

      if (Object.keys(errors).length) {
        return false;
      }

      this.props.fsmTransition({
        command: 'EDIT',
        data: {
          ...values
        }
      });

      return true;
    }

    render() {
      const { formik, ...rest } = this.props;
 
      return (
        <Component
          {...rest}
          handleUpdate={this.onUpdate}
          formik={formik}
        />
      );
    }
  }

  return withMachineContext(connect(Updateable));
}

export default withUpdateable;
