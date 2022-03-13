import React from 'react';
import { Switch, Route } from 'react-router';

import routes from './routes.js';
import { boardService } from './services/board.service.js';
import { socketService } from './services/socket.service.js';

export class RootCmp extends React.Component {
	render() {
		return (
			<div>
				<main>
					<Switch>
						{routes.map((route) => (
							<Route
								key={route.path}
								// exact
								component={route.component}
								path={route.path}
							/>
						))}
					</Switch>
				</main>
			</div>
		);
	}
}
