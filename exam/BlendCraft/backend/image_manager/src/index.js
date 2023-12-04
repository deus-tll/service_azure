import express from 'express';
import craftImageRouter from './routers/craft_image_router.js';

const app = express();
const port= 80;


app.use('/api/image/manager', craftImageRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});