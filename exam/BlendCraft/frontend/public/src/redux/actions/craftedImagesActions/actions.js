import axios from "axios";
import {
  dispatchCraftedImagesError,
  dispatchCraftedImagesRequest,
  dispatchFetchCraftedImagesSuccess, dispatchFetchCraftedImageSuccess
} from "./dispatchers";


export const fetchCraftedImages = () => async (dispatch) => {
  dispatch(dispatchCraftedImagesRequest());

  try {
    const storedToken = localStorage.getItem('token');

    const response = await axios.get('/api/image/manager/get_crafted_images', {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });

    dispatch(dispatchFetchCraftedImagesSuccess({ craftedImages: response.data}));
  }
  catch (error) {
    dispatch(dispatchCraftedImagesError(error.message));
  }
};


export const fetchCraftedImage = (craftedImageId) => async (dispatch) => {
  dispatch(dispatchCraftedImagesRequest());

  try {
    const storedToken = localStorage.getItem('token');

    const response = await axios.get(`/api/database/manager/get_crafted_image_by_id/${craftedImageId}`, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });

    if (response.status === 404) {
      dispatch(dispatchCraftedImagesError(response.data.error || 'Crafted image not found'));
    } else {
      dispatch(dispatchFetchCraftedImageSuccess({ craftedImage: response.data }));
    }
  }
  catch (error) {
    dispatch(dispatchCraftedImagesError(error.message));
  }
};