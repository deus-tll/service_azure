import {
  dispatchCraftedImagesError,
  dispatchCraftedImagesRequest,
  dispatchFetchCraftedImagesSuccess
} from "./dispatchers";
import axios from "axios";


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
    dispatch(dispatchCraftedImagesError(error));
  }
};