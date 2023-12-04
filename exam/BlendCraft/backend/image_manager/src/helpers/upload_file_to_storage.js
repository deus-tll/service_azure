import axios from 'axios';

export async function uploadFileToStorage(craftedImageId, file, fileName) {
  const formData = new FormData();
  formData.append('file', file.buffer);
  formData.append('fileName', fileName);
  formData.append('craftedImageId', craftedImageId);

  return await axios.post('/api/azure/upload/upload_images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  });
}