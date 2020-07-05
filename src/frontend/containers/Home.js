/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import Search from '../components/Search';
import Categories from '../components/Categories';
import Carousel from '../components/Carousel';
import CarouselItem from '../components/CarouselItem';
import '../assets/styles/containers/Home.scss';

const Home = ({
  myList,
  trends,
  originals,
  trendsMatch,
  originalsMatch,
  myListMatch,
  query,
}) => {
  const trendsResult = query ? trendsMatch : trends;
  const originalsResult = query ? originalsMatch : originals;
  const myListResult = query ? myListMatch : myList;
  const message = query
    ? 'No se encontraron resultados.'
    : 'No has agregado favoritos.';

  const renderCarousel = () => {
    const renderCarouselItem = (data, isMyList = false) => {
      if (data.length === 0) {
        return <div className="playlist-empty">{message}</div>;
      }
      return data.map((item) => (
        <CarouselItem key={item._id} {...item} isList={isMyList} />
      ));
    };

    return (
      <>
        {myListResult && (
          <Categories title="Mi Lista">
            <Carousel>{renderCarouselItem(myListResult, true)}</Carousel>
          </Categories>
        )}
        {trendsResult && (
          <Categories title="Tendencias">
            <Carousel>{renderCarouselItem(trendsResult)}</Carousel>
          </Categories>
        )}
        {originalsResult && (
          <Categories title="Originales">
            <Carousel>{renderCarouselItem(originalsResult)}</Carousel>
          </Categories>
        )}
      </>
    );
  };

  return (
    <>
      <Search />
      {renderCarousel()}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    myList: state.myList,
    trends: state.trends,
    originals: state.originals,
    trendsMatch: state.trendsMatch,
    originalsMatch: state.originalsMatch,
    myListMatch: state.myListMatch,
    query: state.query,
  };
};

export default connect(mapStateToProps, null)(Home);
