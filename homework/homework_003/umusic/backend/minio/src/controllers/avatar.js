import minioClient from "../helpers/minio.js";


const BUCKET_AVATARS_NAME = process.env.BUCKET_AVATARS_NAME || "upload.avatars";


export default function (request, response) {
  if (request.files && request.files.avatar) {
    console.debug(request.files.avatar);

    const avatarFile = request.files.avatar;
    const objectName = avatarFile.name;

    minioClient.putObject(BUCKET_AVATARS_NAME, objectName, avatarFile.data, (err, etag) => {
      if (err) {
        console.error(err);
        return response.status(500).json({ error: 'Failed to upload avatar' });
      }

      console.log('Avatar uploaded successfully');

      return response.status(200).json({ message: 'Avatar uploaded successfully' });
    });
  }
  else {
    return response.status(400).json({ error: 'Avatar file not provided' });
  }
}