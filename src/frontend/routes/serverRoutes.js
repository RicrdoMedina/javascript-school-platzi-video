import Home from '../containers/Home';
import Login from '../containers/Login';
import Register from '../containers/Register';
import NoFound from '../containers/NoFound';
import Player from '../containers/Player';

const serverRoutes = (isLogged) => {
  return [
    {
      exact: true,
      path: '/',
      component: isLogged ? Home : Login,
    },
    {
      exact: true,
      path: '/login',
      component: Login,
    },
    {
      exact: true,
      path: '/register',
      component: Register,
    },
    {
      exact: true,
      path: '/player',
      component: isLogged ? Player : Login,
    },
    {
      name: 'NotFound',
      component: NoFound,
    },
  ];
};

export default serverRoutes;
