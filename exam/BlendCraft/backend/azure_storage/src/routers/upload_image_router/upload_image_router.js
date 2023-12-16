import express from 'express';
import multer from 'multer';
import uploadImageHandler from "./request_handlers/upload_image_handler.js";


const router = express.Router();
const upload = multer();


router.post('/upload_image', upload.single('file'), uploadImageHandler);


export default router;