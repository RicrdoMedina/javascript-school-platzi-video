/* eslint-disable global-require */
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import webpack from 'webpack';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { renderRoutes } from 'react-router-config';
import { StaticRouter } from 'react-router-dom';
import cookieParser from 'cookie-parser';
import boom from '@hapi/boom';
import passport from 'passport';
import axios from 'axios';
import Layout from '../frontend/containers/Layout';
import serverRoutes from '../frontend/routes/serverRoutes';
import reducer from '../frontend/reducers/index';
import getManifest from './getManifest';

const session = require('express-session');

dotenv.config();

const { config } = require('./config');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: config.sessionSecret }));
app.use(passport.initialize());
app.use(passport.session());

require('./utils/auth/strategies/basic');

require('./utils/auth/strategies/oauth');

require('./utils/auth/strategies/google');

require('./utils/auth/strategies/twitter');

require('./utils/auth/strategies/facebook');

console.log('MODE:', config.dev ? 'DEVELOPMENT' : 'PRODUCTION');

if (config.dev) {
  console.log('Development config');
  const webpackConfig = require('../../webpack.config');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  const serverConfig = { port: config.port, hot: true };

  app.use(webpackDevMiddleware(compiler, serverConfig));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use((req, res, next) => {
    if (!req.hashManifest) req.hashManifest = getManifest();
    next();
  });
  app.use(express.static(`${__dirname}/public`));
  app.use(helmet());
  app.use(helmet.permittedCrossDomainPolicies());
  app.disable('x-powered-by');
}

const setResponse = (html, preloadedState, manifest) => {
  const mainStyles = manifest ? manifest['main.css'] : 'assets/app.css';
  const mainBuild = manifest ? manifest['main.js'] : 'assets/app.js';
  const vendorBuild = manifest ? manifest['vendors.js'] : 'assets/vendor.js';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Platzi Video</title>
    <link rel="stylesheet" href="${mainStyles}" type="text/css"/>
  </head>
  <body>
    <div id="app">${html}</div>
    <script>
      window.PRELOADED_STATE = ${JSON.stringify(preloadedState).replace(
        /</g,
        '\\u003c'
      )}
    </script>
    <script src="${mainBuild}" type="text/javascript"></script>
    <script src="${vendorBuild}" type="text/javascript"></script>
  </body>
</html>
`;
};

const renderApp = async (req, res) => {
  let initialState;
  const { email, name, id, token } = req.cookies;

  try {
    let movieList = await axios({
      url: `${config.apiUrl}/api/movies`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'get',
    });

    let userMovies = await axios({
      url: `${config.apiUrl}/api/user-movies/?userId=${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'get',
    });

    movieList = movieList.data.data;
    userMovies = userMovies.data.data;

    const myList = [];

    userMovies.forEach((userMovie) => {
      movieList.forEach((movie) => {
        if (movie._id === userMovie.movieId) {
          movie._id = userMovie._id;
          myList.push(movie);
        }
      });
    });

    initialState = {
      user: {
        email,
        name,
        id,
      },
      playing: {},
      myList,
      trends: movieList.filter(
        (movie) => movie.contentRating === 'PG' && movie._id
      ),
      originals: movieList.filter(
        (movie) => movie.contentRating === 'G' && movie._id
      ),
    };
  } catch (error) {
    console.error(`error ${config.apiUrl}/api/movies`, error);
    initialState = {
      user: {},
      playing: {},
      myList: [],
      trends: [],
      originals: [],
    };
  }

  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();
  const isLogged = Boolean(initialState.user.id);
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        <Layout>{renderRoutes(serverRoutes(isLogged))}</Layout>
      </StaticRouter>
    </Provider>
  );

  res.send(setResponse(html, preloadedState, req.hashManifest));
};

//routes
app.post('/auth/sign-in', async (req, res, next) => {
  passport.authenticate('basic', (error, data) => {
    try {
      if (error || !data) {
        next(boom.unauthorized);
      }

      req.login(data, { session: false }, async (err) => {
        if (err) {
          next(err);
        }

        const { token, user } = data;

        res.cookie('token', token, {
          httpOnly: !config.dev,
          secure: !config.dev,
        });

        res.status(200).json({ token, user });
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
});

app.post('/auth/sign-up', async (req, res, next) => {
  const { body: user } = req;

  try {
    const userData = await axios({
      url: `${config.apiUrl}/api/auth/sign-up`,
      method: 'post',
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
      },
    });

    res.status(201).json({
      name: req.body.name,
      email: req.body.email,
      id: userData.data.id,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/user-movies', async (req, res, next) => {
  try {
    const { body: userMovie } = req;
    const { token } = req.cookies;

    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-movies`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'post',
      data: userMovie,
    });

    const {
      data: { movieExist },
    } = data;

    if (status !== 200 && status !== 201) {
      return next(boom.badImplementation());
    }

    const statusCode = movieExist ? 200 : 201;

    return res.status(statusCode).json(data);
  } catch (error) {
    next(error);
  }
});

app.delete('/user-movies/:userMovieId', async (req, res, next) => {
  try {
    const { userMovieId } = req.params;
    const { token } = req.cookies;

    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-movies/${userMovieId}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'delete',
    });

    if (status !== 200) {
      return next(boom.badImplementation());
    }

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

app.get(
  '/auth/google-oauth',
  passport.authenticate('google-oauth', {
    scope: ['email', 'profile', 'openid'],
  })
);

app.get(
  '/auth/google-oauth/callback',
  passport.authenticate('google-oauth', { session: false }),
  (req, res, next) => {
    if (!req.user) {
      next(boom.unauthorized());
    }

    const { token, ...user } = req.user;

    res.cookie('token', token, {
      httpOnly: !config.dev,
      secure: !config.dev,
    });

    res.status(200).json(user);
  }
);

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile', 'openid'],
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res, next) => {
    if (!req.user) {
      next(boom.unauthorized());
    }

    const { token, user } = req.user;

    res.cookie('token', token, {
      httpOnly: !config.dev,
      secure: !config.dev,
    });

    res.cookie('name', user.name);
    res.cookie('email', user.email);
    res.cookie('id', user.id);
    res.redirect('/');
  }
);

app.get('/auth/twitter', passport.authenticate('twitter')); //Usamos nuestra estrategia de twitter, esto redireccionara a twitter

app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { session: false }),
  (req, res, next) => {
    if (!req.user) {
      next(boom.unauthorized());
    }

    const { token, user } = req.user;

    res.cookie('token', token, {
      httpOnly: !config.dev,
      secure: !config.dev,
    });

    res.cookie('name', user.name);
    res.cookie('email', user.email);
    res.cookie('id', user.id);
    res.redirect('/');
  }
);

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  (req, res, next) => {
    if (!req.user) {
      next(boom.unauthorized());
    }

    const { token, user } = req.user;

    res.cookie('token', token, {
      httpOnly: !config.dev,
      secure: !config.dev,
    });

    res.cookie('name', user.name);
    res.cookie('email', user.email);
    res.cookie('id', user.id);
    res.redirect('/');
  }
);

app.get('*', renderApp);

app.listen(config.port, (err) => {
  if (err) console.log(err);
  else console.log(`Server running port ${config.port}`);
});
