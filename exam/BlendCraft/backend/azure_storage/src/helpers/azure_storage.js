import {BlobServiceClient, StorageSharedKeyCredential} from '@azure/storage-blob';

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = 'BlendCraftImages';

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function uploadImage(craftedImageId, file, fileName) {
  if (!(await containerClient.exists())) {
    await containerClient.create();
  }

  const blobName = `${craftedImageId}/${fileName}`;
  const blobClient = containerClient.getBlockBlobClient(blobName);
  await blobClient.uploadData(file.buffer);

  return {
    photoUrl: blobClient.url
  };
}


export default uploadImage;