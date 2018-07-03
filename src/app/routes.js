import React from 'react';
import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';
import { LoginPage } from './pages/login-page';
import { MainPage } from './pages/main-page';
import { NoMatch } from './pages/no-match-page';
// import CounterPage from './containers/CounterPage';

export default () => (
  <div>
    <Link to="/">Home</Link>
    <Link to="/login">Login</Link>
    <Link to="/no-match">404</Link>
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route exact path="/" component={MainPage} />
      <Route component={NoMatch} />
    </Switch>
  </div>
);
