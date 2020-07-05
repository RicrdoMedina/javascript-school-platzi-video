import React from 'react';
import '../assets/styles/components/categories.scss';

const Categories = ({ children, title = 'Mi lista' }) => {
  return (
    <div className='categories'>
      <h2 className='categories__title'>{title}</h2>
      {children}
    </div>
  );
};

export default Categories;
