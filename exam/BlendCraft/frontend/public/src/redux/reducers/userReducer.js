import userActionTypes from "../actionTypes/userActionTypes";

const initialState = {
  user: null,
  error: null,
  loading: false
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case userActionTypes.FETCH_USER_REQUEST:
      return { ...state, loading: true, error: null };

    case userActionTypes.FETCH_USER_SUCCESS:
      return { ...state, loading: false, user: action.payload.user, error: null };

    case userActionTypes.FETCH_USER_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default userReducer;