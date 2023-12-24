import axios from "axios";
import {
  dispatchCreateCraftedImageRequest,
  dispatchErrorCraftingImage, dispatchNullifyCraftedImage,
  dispatchSetCraftedImage, dispatchSetCraftedImageId
} from "./dispatchers";


export const craftImage = (name, filePhotoFront, filePhotoBackground) => async (dispatch) => {
  try {
    dispatch(dispatchCreateCraftedImageRequest());

    const formData = new FormData();
    formData.append('name', name);
    formData.append('filePhotoFront', filePhotoFront);
    formData.append('filePhotoBackground', filePhotoBackground);

    const token = localStorage.getItem('token');

    const response = await axios.post('/api/image/manager/craft_image', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    if (response.status === 201) {
      const craftedImage = response.data.craftedImage;
      dispatch(dispatchSetCraftedImage({ craftedImage: craftedImage._id, loading: true }));
      dispatch(dispatchSetCraftedImageId(craftedImage._id));
    }
    else {
      dispatch(dispatchErrorCraftingImage(response.data.message || 'An error occurred while crafting the image.'));
    }
  }
  catch (error) {
    dispatch(dispatchErrorCraftingImage(error.message));
  }
};


export const updateCraftedImage = (craftedImage, loading = true) => async (dispatch) => {
  dispatch(dispatchSetCraftedImage({ craftedImage: craftedImage, loading: loading }));
};

export const nullifyCraftedImage = () => async (dispatch) => {
  dispatch(dispatchNullifyCraftedImage());
};

export const setErrorCraftingImage = (error) => async (dispatch) => {
  dispatch(dispatchErrorCraftingImage(error));
};