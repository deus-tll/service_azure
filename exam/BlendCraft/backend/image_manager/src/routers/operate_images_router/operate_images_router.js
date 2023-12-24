import express from 'express';
import multer from 'multer';
import craftImageHandler from "./request_handlers/craft_image_handler.js";
import getCraftedImagesHandler from "./request_handlers/get_crafted_images_handler.js";
import getUserIdFromToken from "../../middlewares/get_user_id_from_token_middleware.js";
import getCraftedImageHandler from "./request_handlers/get_crafted_image_handler.js";


const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/craft_image', getUserIdFromToken, upload.fields([
  { name: 'filePhotoFront', maxCount: 1 },
  { name: 'filePhotoBackground', maxCount: 1 }
]), craftImageHandler);


router.get('/get_crafted_images', getUserIdFromToken, getCraftedImagesHandler);

router.get('/get_crafted_image/:craftedImageId', getUserIdFromToken, getCraftedImageHandler);


export default router;