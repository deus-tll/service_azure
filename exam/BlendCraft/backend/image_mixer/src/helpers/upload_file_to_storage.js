import axios from 'axios';


async function uploadFileToStorage(craftedImageId, file, fileName) {
  try {
    const formData = new FormData();
    formData.append('file', file);
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
    console.error('Error processing and uploading file:', error);
    return {
      success: false,
      message: 'Error processing and uploading file',
      error: error.message,
    };
  }
}

export default uploadFileToStorage;