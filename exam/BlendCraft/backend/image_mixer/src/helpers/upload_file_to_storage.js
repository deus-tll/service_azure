import axios from 'axios';
import FormData from 'form-data';

const axiosAzureStorage = axios.create({
  baseURL: 'http://api.azure.upload',
});

async function uploadFileToStorage(craftedImageId, file) {
  try {
    const blob = new Blob([file.buffer], { type: file.type });
    const blobBuff = await blob.arrayBuffer();

    const formData = new FormData();
    formData.append('filePhoto', Buffer.from(blobBuff), file.name);
    formData.append('craftedImageId', craftedImageId);
    formData.append('fileType', file.type);

    const uploadResponse = await axiosAzureStorage.post('/api/azure/upload/upload_image', formData, {
      headers: {
        ...formData.getHeaders(),
        'Content-Type': 'multipart/form-data',
      }
    });

    return {
      success: true,
      message: 'File uploaded successfully to storage.',
      data: uploadResponse.data.uploadedImage,
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