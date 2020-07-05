import React, { useState, useEffect } from 'react';
import { positions, Provider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { withRouter } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

const options = {
  timeout: 5000,
  position: positions.TOP_RIGHT,
};

const Layout = (props) => {
  const [theme, setTheme] = useState('theme--default');
  useEffect(() => {
    const { pathname } = props.location;
    pathname === '/' && props.isLogged && setTheme('theme--purple');
  }, []);

  return (
    <Provider template={AlertTemplate} {...options}>
      <div className={`wrapper ${theme}`}>
        <Header />
        {props.children}
        <Footer />
      </div>
    </Provider>
  );
};

export default withRouter(Layout);
