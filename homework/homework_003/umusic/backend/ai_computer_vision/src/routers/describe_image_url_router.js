import express from 'express';
import describeImage from "../helpers/describe_image.js";


const router = express.Router();


router.post('/describe_image_url', async (req, res) => {
  const imageUrl = req.body.imageUrl;

  console.log(imageUrl);

  const result = describeImage(imageUrl);

  if (result.isSuccess) {
    res.status(200).json({ message: 'Operation ended successfully.', result: result.data });
  }
  else {
    return res.status(500).json({ message: 'Operation failed' });
  }
});

export default router;