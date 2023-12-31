import express from 'express';
import saveCraftedImageHandler from "./request_handlers/save_crafted_image_handler.js";
import getCraftedImagesByUserIdHandler from "./request_handlers/get_crafted_images_by_user_id_handler.js";
import getCraftedImageByIdHandler from "./request_handlers/get_crafted_image_by_id_handler.js";


const router = express.Router();


router.post('/save_crafted_image', saveCraftedImageHandler);
router.get('/get_crafted_images_by_user_id/:userId', getCraftedImagesByUserIdHandler);
router.get('/get_crafted_image_by_id/:craftedImageId', getCraftedImageByIdHandler);


export default router;