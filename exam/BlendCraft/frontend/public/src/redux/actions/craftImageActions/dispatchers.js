import craftImageActionTypes from "../../actionTypes/craftImageActionTypes";

export const dispatchCreateCraftedImageRequest = () => ({ type: craftImageActionTypes.CREATE_CRAFTED_IMAGE_REQUEST });
export const dispatchNullifyCraftedImage = () => ({ type: craftImageActionTypes.NULLIFY_CRAFTED_IMAGE });
export const dispatchSetCraftedImage = (data) => ({ type: craftImageActionTypes.SET_CRAFTED_IMAGE, payload: data });
export const dispatchErrorCraftingImage = (error) => ({ type: craftImageActionTypes.ERROR_CRAFTING_IMAGE, payload: error });
export const dispatchSetCraftedImageId = (craftedImageId) => ({ type: craftImageActionTypes.SET_CRAFTED_IMAGE_ID, payload: craftedImageId });