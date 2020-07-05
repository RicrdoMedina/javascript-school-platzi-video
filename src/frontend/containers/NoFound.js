import React from 'react';
import '../assets/styles/containers/NoFound.scss';
import NoFoundIcon from '../assets/static/404-png-6.png';

const NoFound = () => {
  return (
    <section className='no-found'>
      <div className='no-found__container'>
        <img
          className='no-found__container--img'
          src={NoFoundIcon}
          alt='Page no found'
        />
        <h1 className='no-found__container--title'>Sorry, page no found!</h1>
      </div>
    </section>
  );
};

export default NoFound;
