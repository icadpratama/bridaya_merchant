import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import AppLayout from '../../layout/AppLayout';

const Items = React.lazy(() =>
    import('./items')
);

const Cashiers = ({ match }) => (
    <AppLayout>
        <div className="dashboard-wrapper">
            <Suspense fallback={<div className="loading" />}>
                <Switch>
                    <Redirect exact from={`${match.url}/`} to={`${match.url}/items`} />
                    <Route
                        path={`${match.url}/items`}
                        render={props => <Items {...props} />}
                    />
                    <Redirect to="/error" />
                </Switch>
            </Suspense>
        </div>
    </AppLayout>
);
export default Cashiers;
