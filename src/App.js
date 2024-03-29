import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import './helpers/Firebase';
import AppLocale from './lang';
import ColorSwitcher from './components/common/ColorSwitcher';
import NotificationContainer from './components/common/react-notifications/NotificationContainer';
import { isMultiColorActive, isDemo } from './constants/defaultValues';
import { getDirection } from './helpers/Utils';

const ViewMain = React.lazy(() =>
  import('./views')
);
const ViewDashboard = React.lazy(() =>
  import('./views/dashboards')
);
const ViewCapital = React.lazy(() =>
  import('./views/capital')
);
const ViewCashier = React.lazy(() =>
  import('./views/cashiers')
);
const ViewConsultation = React.lazy(() =>
  import('./views/consultation')
);
const ViewData = React.lazy(() =>
  import('./views/data')
);
const ViewUser = React.lazy(() =>
  import('./views/user')
);
const ViewError = React.lazy(() =>
  import('./views/error')
);

const AuthRoute = ({ component: Component, authUser, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authUser || isDemo ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: '/user/login',
                state: { from: props.location }
              }}
            />
          )
      }
    />
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    const direction = getDirection();
    if (direction.isRtl) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }

  render() {
    const { locale, loginUser } = this.props;
    const currentAppLocale = AppLocale[locale];

    return (
      <div className="h-100">
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <React.Fragment>
            <NotificationContainer />
            {isMultiColorActive && <ColorSwitcher />}
            <Suspense fallback={<div className="loading" />}>
              <Router>
                <Switch>
                  <AuthRoute
                    path="/cashiers"
                    authUser={loginUser}
                    component={ViewCashier}
                  />
                  <Route
                    path="/dashboards"
                    render={props => <ViewDashboard {...props} />}
                  />
                  <Route
                    path="/capital"
                    render={props => <ViewCapital {...props} />}
                  />
                  <Route
                    path="/cashiers"
                    render={props => <ViewCashier {...props} />}
                  />
                  <Route
                    path="/consultation"
                    render={props => <ViewConsultation {...props} />}
                  />
                  <Route
                    path="/data"
                    render={props => <ViewData {...props} />}
                  />
                  <Route
                    path="/user"
                    render={props => <ViewUser {...props} />}
                  />
                  <Route
                    path="/error"
                    exact
                    render={props => <ViewError {...props} />}
                  />
                  <Route
                    path="/"
                    exact
                    render={props => <ViewMain {...props} />}
                  />
                  <Redirect to="/error" />
                </Switch>
              </Router>
            </Suspense>
          </React.Fragment>
        </IntlProvider>
      </div>
    );
  }
}

const mapStateToProps = ({ authUser, settings }) => {
  const { user: loginUser } = authUser;
  const { locale } = settings;
  return { loginUser, locale };
};
const mapActionsToProps = {};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(App);
