import axios from 'axios';

const axiosAzureStorage = axios.create({
  baseURL: 'http://api.azure.upload',
});

async function uploadFileToStorage(craftedImageId, file, fileName) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('craftedImageId', craftedImageId);
    formData.append('fileName', fileName);

    const uploadResponse = await axiosAzureStorage.post('/api/azure/upload/upload_image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });

    return {
      success: true,
      message: 'File uploaded successfully to storage.',
      data: uploadResponse.data,
    };
  }
  catch (error) {
    const message = 'Error processing and uploading file to storage';
    console.error(`${message}: `, error);
    return {
      success: false,
      message: message,
      error: error.message,
    };
  }
}

export default uploadFileToStorage;