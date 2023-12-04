import axios from 'axios';
import sharp from 'sharp';


export async function uploadFileToStorage(craftedImageId, photoFrontUrlNoBg, fileName) {
  try {
    const response = await axios({
      method: 'get',
      url: photoFrontUrlNoBg,
      responseType: 'arraybuffer'
    });

    const buffer = await sharp(response.data).toBuffer();
    const fileToSend = new File([buffer], `${fileName}.png`, { type: 'image/png' });

    const formData = new FormData();
    formData.append('file', fileToSend);
    formData.append('craftedImageId', craftedImageId);
    formData.append('fileName', fileName);

    const uploadResponse = await axios.post('/api/azure/upload/upload_images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });

    return {
      success: true,
      message: 'File uploaded successfully',
      data: uploadResponse.data,
    };
  }
  catch (error) {
    console.error('Error processing and uploading photo:', error);
    return {
      success: false,
      message: 'Error processing and uploading photo',
      error: error.message,
    };
  }
}