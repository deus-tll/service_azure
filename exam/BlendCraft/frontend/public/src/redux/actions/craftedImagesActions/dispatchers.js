import craftedImagesActionTypes from "../../actionTypes/craftedImagesActionTypes";

export const dispatchCraftedImagesRequest = () => ({ type: craftedImagesActionTypes.CRAFTED_IMAGES_REQUEST });
export const dispatchCraftedImagesError = (error) => ({ type: craftedImagesActionTypes.CRAFTED_IMAGES_ERROR, payload: error });
export const dispatchFetchCraftedImagesSuccess = (data) => ({ type: craftedImagesActionTypes.FETCH_CRAFTED_IMAGES_SUCCESS, payload: data });
