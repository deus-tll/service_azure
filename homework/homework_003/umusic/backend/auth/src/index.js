import express from 'express';
import { login } from "./controllers/auth/login.js";
import { register } from "./controllers/auth/register.js";



const app = express();
const port = 80;
const urlencodedParser = express.urlencoded({extended: false});



app.use(express.json());

app.post("/api/auth/login", urlencodedParser, login);
app.post('/api/auth/register', urlencodedParser, register);

app.listen(port, () => {
  console.log("http server started")
});