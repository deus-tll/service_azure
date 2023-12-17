import {dispatchUserError, dispatchUserRequest, dispatchUserSuccess} from "./dispatchers";
import axios from "axios";


export const fetchUser = () => async (dispatch) => {
  dispatch(dispatchUserRequest());

  try {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      dispatch(dispatchUserSuccess({ user: JSON.parse(storedUser) }));
      console.log("FROM LOCAL STORAGE", {storedUser, storedToken});
    }
    else {
      const response = await axios.get('/api/auth/get_initial_user');
      const { accessToken, user } = response.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', accessToken);

      dispatch(dispatchUserSuccess({ user: user }));
      console.log("FROM SERVER", {user, accessToken});
    }
  }
  catch (error) {
    dispatch(dispatchUserError(error));
  }
};