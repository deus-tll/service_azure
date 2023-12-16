import express from 'express';
import getInitialUser from "./helpers/get_initial_user.js";


const app = express();
const port= 80;


app.use(express.json());

app.get('/api/auth/get_initial_user', getInitialUser);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});