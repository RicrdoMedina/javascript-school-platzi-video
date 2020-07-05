import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import reducer from './reducers';
import App from './routes/App';

const history = createBrowserHistory();

const preloadedState = window.PRELOADED_STATE;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  preloadedState,
  composeEnhancers(applyMiddleware(thunk))
);

const container = document.getElementById('app');

delete window.PRELOADED_STATE;

ReactDOM.hydrate(
  <Provider store={store}>
    <Router history={history}>
      <App isLogged={Boolean(preloadedState.user.id)} />
    </Router>
  </Provider>,
  container
);
