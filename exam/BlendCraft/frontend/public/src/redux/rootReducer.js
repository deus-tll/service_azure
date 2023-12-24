import { combineReducers } from '@reduxjs/toolkit';
import userReducer from "./reducers/userReducer";
import craftedImagesReducer from "./reducers/craftedImagesReducer";
import craftImageReducer from "./reducers/craftImageReducer";

const rootReducer = combineReducers({
  user: userReducer,
  craftedImages: craftedImagesReducer,
  craftImage: craftImageReducer
});

export default rootReducer;