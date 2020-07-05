import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { registerUser } from '../actions';
import '../assets/styles/containers/Login.scss';

const Register = (props) => {
  const [form, setValues] = useState({
    email: '',
    name: '',
    password: '',
  });

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.registerUser(form, '/login');
  };

  return (
    <section className="login">
      <div className="login__container">
        <h2>Regístrate</h2>
        <form
          action=""
          className="login__container--form"
          onSubmit={handleSubmit}
        >
          <input
            className="input"
            type="text"
            name="name"
            id="name"
            placeholder="Full Name"
            onChange={handleInput}
          />
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
            placeholder="Password"
            onChange={handleInput}
          />
          <button className="button" type="submit">
            Registrarme
          </button>
        </form>
        <Link to="/login" className="login__container--link">
          Iniciar sesión
        </Link>
      </div>
    </section>
  );
};

const mapDispatchToProps = {
  registerUser,
};

export default connect(null, mapDispatchToProps)(Register);
