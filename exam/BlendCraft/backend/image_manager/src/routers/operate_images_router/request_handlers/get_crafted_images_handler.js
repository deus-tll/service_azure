import axios from "axios";

const axiosDatabase = axios.create({
  baseURL: 'http://api.database.manager',
});

const getCraftedImagesHandler = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      console.error('User ID is required.');
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const response = await axiosDatabase.get(`/api/database/manager/get_crafted_images_by_user_id/${userId}`);
    const craftedImages = response.data;

    res.status(200).json(craftedImages);
  }
  catch (error) {
    console.error('Error getting crafted images:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

export default getCraftedImagesHandler;