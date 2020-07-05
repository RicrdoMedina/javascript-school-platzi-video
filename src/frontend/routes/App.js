import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from '../containers/Home';
import Login from '../containers/Login';
import Register from '../containers/Register';
import NoFound from '../containers/NoFound';
import Layout from '../containers/Layout';
import Player from '../containers/Player';

const App = ({ isLogged }) => (
  <BrowserRouter>
    <Layout isLogged={isLogged}>
      <Switch>
        <Route exact path="/" component={isLogged ? Home : Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/player" component={isLogged ? Player : Login} />
        <Route key="error404" component={NoFound} />
      </Switch>
    </Layout>
  </BrowserRouter>
);

export default App;
