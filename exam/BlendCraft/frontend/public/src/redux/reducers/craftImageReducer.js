import craftImageActionTypes from "../actionTypes/craftImageActionTypes";


const initialState  = {
  craftedImage: null,
  craftedImageId: null,
  error: null,
  loading: false
};

const craftImageReducer = (state = initialState, action) => {
  switch (action.type) {
    case craftImageActionTypes.CREATE_CRAFTED_IMAGE_REQUEST:
      return { ...state, loading: true, error: null };

    case craftImageActionTypes.NULLIFY_CRAFTED_IMAGE:
      return { ...state, craftedImage: null, craftedImageId: null, loading: false, error: null };

    case craftImageActionTypes.SET_CRAFTED_IMAGE:
      return {
        ...state,
        craftedImage: action.payload.craftedImage,
        loading: action.payload.loading,
        error: null
      };

    case craftImageActionTypes.SET_CRAFTED_IMAGE_ID:
      return { ...state, craftedImageId: action.payload }

    case craftImageActionTypes.ERROR_CRAFTING_IMAGE:
      return { ...state, loading: false, error: action.payload }

    default:
      return state;
  }
};

export default craftImageReducer;