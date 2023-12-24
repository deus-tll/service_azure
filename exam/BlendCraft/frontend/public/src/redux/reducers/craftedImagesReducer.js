import craftedImagesActionTypes from "../actionTypes/craftedImagesActionTypes";

const initialState  = {
  craftedImages: [],
  currentCraftedImage: null,
  error: null,
  loading: false,
};

const craftedImagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case craftedImagesActionTypes.CRAFTED_IMAGES_REQUEST:
      return { ...state, loading: true, error: null };

    case craftedImagesActionTypes.CRAFTED_IMAGES_ERROR:
      return { ...state, loading: false, error: action.payload };

    case craftedImagesActionTypes.FETCH_CRAFTED_IMAGES_SUCCESS:
      return { ...state, loading: false, craftedImages: action.payload.craftedImages, error: null };

    case craftedImagesActionTypes.FETCH_CRAFTED_IMAGE_SUCCESS:
      return { ...state, loading: false, currentCraftedImage: action.payload.craftedImage, error: null };

    default:
      return state;
  }
};

export default craftedImagesReducer;