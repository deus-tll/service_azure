import express from 'express';
import uploadImageRouter from './routers/upload_image_router.js';

const app = express();
const port= 80;

app.use(express.json());

app.use('/api/azure/upload', uploadImageRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});