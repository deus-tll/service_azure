import express from 'express';
import operateImagesRouter from './routers/operate_images_router/operate_images_router.js';
import operateUsersRouter from './routers/operate_users_router/operate_users_router.js';
import initializeDatabase from "./helpers/initialize_database.js";


const app = express();
const port = 80;


app.use(express.json());
app.use('/api/database/manager', operateUsersRouter);
app.use('/api/database/manager', operateImagesRouter);


await initializeDatabase();


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});