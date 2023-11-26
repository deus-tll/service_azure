import express from 'express';
import fileUpload from 'express-fileupload';
import { urlencoded, json } from 'express';

import uploadAvatar from './controllers/avatar.js';


const MINIO_SERVER_PORT = process.env.MINIO_SERVER_PORT || 80;


const app = express();
app.use(fileUpload({}));
app.use(json());
app.use(urlencoded({ extended: false }));


app.post('/api/minio/upload/avatar', uploadAvatar);


app.listen(MINIO_SERVER_PORT, () => {
  console.log(`http file upload server started on port ${MINIO_SERVER_PORT}`);
});