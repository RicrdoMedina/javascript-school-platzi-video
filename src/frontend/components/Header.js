import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { logoutRequest } from '../actions';
import gravatar from '../utils/gravatar';
import '../assets/styles/components/header.scss';
import logo from '../assets/static/logo-platzi-video-BW2.png';
import iconProfile from '../assets/static/user-icon.svg';

const Header = (props) => {
  const { user } = props;

  const hasUser = Object.keys(user).length > 0 && user.id;

  const handleLogout = () => {
    document.cookie = 'email=';
    document.cookie = 'name=';
    document.cookie = 'id=';
    props.logoutRequest({});
    window.location.href = '/login';
  };

  return (
    <header className="header header--purple">
      <Link to="/">
        <img className="header__img" src={logo} alt="Logo Platzi video" />
      </Link>
      <div className="header__menu">
        <div className="header__menu--profile">
          {hasUser ? (
            <img src={gravatar(user.email)} alt={user.email} />
          ) : (
            <img src={iconProfile} alt="Avatar" />
          )}
          <p>Perfil</p>
        </div>

        {hasUser ? (
          <ul className="header__menu--list">
            <li>
              {/* <Link to="/profile">{user.name}</Link> */}
              <a href="">{user.name}</a>
            </li>
            <li>
              <a href="" onClick={handleLogout}>
                Salir
              </a>
            </li>
          </ul>
        ) : (
          <ul className="header__menu--list">
            <li>
              <Link to="/login">Iniciar Sesion</Link>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.object,
  logoutRequest: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  logoutRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
