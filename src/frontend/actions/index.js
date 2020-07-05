import axios from 'axios';

export const setFavorite = (payload) => ({
  type: 'SET_FAVORITE',
  payload,
});

export const deleteFavorite = (payload) => ({
  type: 'DELETE_FAVORITE',
  payload,
});

export const loginRequest = (payload) => ({
  type: 'LOGIN_REQUEST',
  payload,
});

export const logoutRequest = (payload) => ({
  type: 'LOGOUT_REQUEST',
  payload,
});

export const registerRequest = (payload) => ({
  type: 'REGISTER_REQUEST',
  payload,
});

export const setError = (payload) => ({
  type: 'SET_ERROR',
  payload,
});

export const registerUser = (payload, redirectUrl) => (dispatch) => {
  axios
    .post('/auth/sign-up', payload)
    .then(({ data }) => dispatch(registerRequest(data)))
    .then(() => {
      window.location.href = redirectUrl;
    })
    .catch((err) => dispatch(setError(err)));
};

export const loginUser = ({ email, password }, redirectUrl) => (dispatch) => {
  axios({
    url: '/auth/sign-in',
    method: 'post',
    auth: {
      username: email,
      password,
    },
  })
    .then(({ data }) => {
      document.cookie = `email=${data.user.email}`;
      document.cookie = `name=${data.user.name}`;
      document.cookie = `id=${data.user.id}`;

      dispatch(loginRequest(data.user));
    })
    .then(() => {
      window.location.href = redirectUrl;
    })
    .catch((err) => dispatch(setError(err)));
};

export const favoriteMovie = (userId, movie, cb) => (dispatch) => {
  const data = {
    userId,
    movieId: movie._id,
  };
  axios({
    url: '/user-movies',
    method: 'post',
    data,
  })
    .then(({ data }) => {
      const {
        data: { movieExist, createdUserMovieId },
      } = data;

      debugger;

      const message = movieExist
        ? `${movie.title} ya esta en tus favoritos`
        : `${movie.title} fue agregada a tus favoritos`;

      if (!movieExist) {
        movie._id = createdUserMovieId;
        dispatch(setFavorite(movie));
      }

      cb(movieExist, message);
    })
    .catch((err) => dispatch(setError(err)));
};

export const deleteMovie = (userMovieId, cb) => (dispatch) => {
  axios({
    url: `/user-movies/${userMovieId}`,
    method: 'delete',
  })
    .then(({ status }) => {
      if (status === 200) {
        dispatch(deleteFavorite(userMovieId));
        cb();
      }
    })
    .catch((err) => dispatch(setError(err)));
};

export const getVideoSource = (payload) => ({
  type: 'GET_VIDEO_SOURCE',
  payload,
});

export const setQuery = (payload) => ({
  type: 'SET_QUERY',
  payload,
});

export const getVideos = (payload) => ({
  type: 'GET_VIDEOS',
  payload,
});
