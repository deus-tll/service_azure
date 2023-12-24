import express from 'express';
import multer from 'multer';
import uploadImageHandler from "./request_handlers/upload_image_handler.js";


const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/upload_image', upload.single('filePhoto'), uploadImageHandler);


export default router;