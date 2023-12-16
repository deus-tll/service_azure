import userActionTypes from "../../actionTypes/userActionTypes";

export const dispatchUserRequest = () => ({ type: userActionTypes.FETCH_USER_REQUEST });
export const dispatchUserSuccess = (data) => ({ type: userActionTypes.FETCH_USER_SUCCESS, payload: data });
export const dispatchUserError = (error) => ({ type: userActionTypes.FETCH_USER_ERROR, payload: error });