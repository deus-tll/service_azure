import { combineReducers } from '@reduxjs/toolkit';
import userReducer from "./reducers/userReducer";
import craftedImagesReducer from "./reducers/craftedImagesReducer";

const rootReducer = combineReducers({
  user: userReducer,
  craftedImages: craftedImagesReducer
});

export default rootReducer;