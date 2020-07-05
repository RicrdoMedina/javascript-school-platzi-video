import React from 'react';
import { connect } from 'react-redux';
import { useAlert } from 'react-alert';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { deleteMovie, favoriteMovie } from '../actions';
import '../assets/styles/components/carouselItem.scss';
import playIcon from '../assets/static/play-icon.png';
import plusIcon from '../assets/static/plus-icon.png';
import deleteIcon from '../assets/static/remove-icon.png';

const CarouselItem = (props) => {
  const {
    _id,
    cover,
    title,
    year,
    contentRating,
    duration,
    source,
    isList,
    favoriteMovie,
    deleteMovie,
    myList,
    user,
  } = props;

  const alert = useAlert();

  const handleSetFavorite = () => {
    const exist = myList.find((item) => item._id === _id);

    if (exist) {
      alert.show(`${title} ya fue agregado a tu lista`);
    } else {
      const movie = {
        _id,
        cover,
        title,
        year,
        contentRating,
        duration,
      };

      const userId = user.id;

      const cb = (error, message) => {
        error ? alert.error(message) : alert.success(message);
      };

      favoriteMovie(userId, movie, cb);
    }
  };

  const handleDeleteFavorite = () => {
    const cb = () => {
      alert.success(`${title} ha sido eliminado de tu lista`);
    };
    deleteMovie(_id, cb);
  };

  const handlePlayVideo = () => {
    const { history } = props;

    props.history.push('/player', {
      id: _id,
      source,
    });
  };

  return (
    <div className="carousel-item">
      <img className="carousel-item__img" src={cover} alt={title} />
      <div className="carousel-item__details">
        <div>
          <div onClick={handlePlayVideo}>
            <img
              className="carousel-item__details--icon"
              src={playIcon}
              alt="Play"
            />
          </div>
          {isList ? (
            <img
              className="carousel-item__details--icon"
              src={deleteIcon}
              alt="Delete"
              onClick={handleDeleteFavorite}
            />
          ) : (
            <img
              className="carousel-item__details--icon"
              src={plusIcon}
              alt="Plus"
              onClick={handleSetFavorite}
            />
          )}
        </div>
        <h3 className="carousel-item__details--title">{title}</h3>
        <p className="carousel-item__details--subtitle">
          {`${year} ${contentRating} ${duration}`}
        </p>
      </div>
    </div>
  );
};

CarouselItem.propTypes = {
  cover: PropTypes.string,
  title: PropTypes.string,
  year: PropTypes.number,
  contentRating: PropTypes.string,
  duration: PropTypes.number,
};

const mapStateToProps = (state) => {
  return {
    myList: state.myList,
    user: state.user,
  };
};

const mapDispatchToProps = {
  deleteMovie,
  favoriteMovie,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CarouselItem)
);
