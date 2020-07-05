import React from 'react';
import { connect } from 'react-redux';
import { getVideos, setQuery } from '../actions';
import '../assets/styles/components/search.scss';

const Search = (props) => {
  const handleChange = (event) => {
    console.log('event', event.target.value);
    const query = event.target.value;
    props.setQuery(query);
    props.getVideos(query);
  };

  return (
    <section className='main'>
      <h2 className='main__title'>¿Qué quieres ver hoy?</h2>
      <input
        className='main__input main__input--search'
        type='text'
        name='search'
        placeholder='Buscar...'
        onChange={handleChange}
      />
    </section>
  );
};

const mapDispatchToProps = {
  getVideos,
  setQuery,
};

export default connect(null, mapDispatchToProps)(Search);
