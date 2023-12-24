import {BlobServiceClient, StorageSharedKeyCredential} from '@azure/storage-blob';

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = 'blend-craft-images';

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function uploadImage(craftedImageId, file, fileType) {
  if (!file || !file.buffer) {
    throw new Error("Invalid file object");
  }

  if (!(await containerClient.exists())) {
    await containerClient.create({ access: 'container' });
  }

  let fileExtension = fileType.split('/')[1];

  const blobName = `${craftedImageId}/${file.originalname}.${fileExtension}`;
  const blobClient = containerClient.getBlockBlobClient(blobName);
  const options = { blobHTTPHeaders: { blobContentType: fileType } };
  await blobClient.uploadData(file.buffer, options);

  return {
    photoUrl: blobClient.url
  };
}


export default uploadImage;