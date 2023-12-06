import express from 'express';
import describeImageUrlRouter from "./routers/describe_image_url_router.js";



const app = express();
const port= 80;

app.use(express.json());

app.use('/api/ai_computer_vision', describeImageUrlRouter);


app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});