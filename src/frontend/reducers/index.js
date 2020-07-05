const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FAVORITE':
      return {
        ...state,
        myList: [...state.myList, action.payload],
        myListMatch: state.query ? [...state.myListMatch, action.payload] : [],
      };
    case 'DELETE_FAVORITE':
      return {
        ...state,
        myList: state.myList.filter((items) => items._id !== action.payload),
        myListMatch: state.query
          ? state.myListMatch.filter((items) => items._id !== action.payload)
          : [],
      };
    case 'LOGIN_REQUEST':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT_REQUEST':
      return {
        ...state,
        user: action.payload,
      };
    case 'REGISTER_REQUEST':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_QUERY':
      return {
        ...state,
        query: action.payload,
      };
    case 'GET_VIDEOS':
      return {
        ...state,
        trendsMatch: state.trends.filter((item) => {
          return item.title
            .toLowerCase()
            .includes(action.payload.toLowerCase());
        }),
        originalsMatch: state.originals.filter((item) => {
          return item.title
            .toLowerCase()
            .includes(action.payload.toLowerCase());
        }),
        myListMatch: state.myList.filter((item) => {
          return item.title
            .toLowerCase()
            .includes(action.payload.toLowerCase());
        }),
      };
    case 'GET_VIDEO_SOURCE':
      return {
        ...state,
        playing:
          state.trends.find((item) => item._id === action.payload) ||
          state.originals.find((item) => item._id === action.payload) ||
          [],
      };
    default:
      return state;
  }
};

export default reducer;
