import React from 'react';
import Wizard from 'components/wizard';
import { withRouter } from 'react-router-dom';

class ImpactSection extends React.Component {
	render() {
		return (
			<Wizard.Section name="impact" {...this.props}>
				<h3>impact section</h3>
			</Wizard.Section>
		)
	}
}

export default withRouter(ImpactSection);
