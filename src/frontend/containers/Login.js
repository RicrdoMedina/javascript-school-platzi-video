import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from '../actions';
import googleIcon from '../assets/static/google-icon.png';
import twitterIcon from '../assets/static/twitter-icon.png';
import facebookIcon from '../assets/static/facebook-icon.svg';
import '../assets/styles/containers/Login.scss';

const Login = (props) => {
  const [form, setValues] = useState({
    email: '',
  });

  useEffect(() => {}, []);

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    props.loginUser(form, '/');
  };

  return (
    <section className="login">
      <div className="login__container">
        <h2>Inicia sesión</h2>
        <form
          action=""
          className="login__container--form"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <input
            className="input"
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            onChange={handleInput}
          />
          <input
            className="input"
            type="password"
            name="password"
            id="password"
            placeholder="Passoword"
            onChange={handleInput}
          />
          <button className="button" type="submit">
            Iniciar sesión
          </button>
          <div className="login__container--remember-me">
            <label>
              <input type="checkbox" name="" id="remember-me" value="" />
              Recuerdame
            </label>
            <Link to="/">Olvidé mi contraseña</Link>
          </div>
        </form>
        <section className="login__container--social-media">
          <div>
            <a href="/auth/google">
              <img className="" src={googleIcon} alt="Google" />
              Inicia sesión con google
            </a>
          </div>
          <div>
            <a href="/auth/twitter">
              <img className="" src={twitterIcon} alt="Twitter" />
              Inicia sesión con twitter
            </a>
          </div>
          <div>
            <a href="/auth/facebook">
              <img className="" src={facebookIcon} alt="Facebook" />
              Inicia sesión con facebook
            </a>
          </div>
        </section>
        <p className="login__container--register">
          No tienes ninguna cuenta <Link to="/register">registrate</Link>
        </p>
      </div>
    </section>
  );
};

const mapDispatchToProps = {
  loginUser,
};

export default connect(null, mapDispatchToProps)(Login);
