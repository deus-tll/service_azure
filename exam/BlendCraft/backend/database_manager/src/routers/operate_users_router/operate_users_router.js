import express from 'express';
import getInitialUser from "./request_handlers/get_initial_user.js";


const router = express.Router();


router.get('/get_initial_user', getInitialUser);


export default router;