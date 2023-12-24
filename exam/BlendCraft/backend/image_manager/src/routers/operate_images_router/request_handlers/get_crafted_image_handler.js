import axios from "axios";

const axiosDatabase = axios.create({
  baseURL: 'http://api.database.manager',
});

const getCraftedImageHandler = async (req, res) => {
  try {
    const craftedImageId = req.params.craftedImageId;

    if (!craftedImageId) {
      console.error('Crafted Image ID is required.');
      return res.status(400).json({ message: 'Crafted Image ID is required.' });
    }

    const response = await axiosDatabase.get(`/api/database/manager/get_crafted_image_by_id/${craftedImageId}`);

    if (response.status === 404) {
      return res.status(404).json({ error: response.data.error || 'Crafted image not found' });
    }

    res.status(200).json(response.data);
  }
  catch (error) {
    console.error('Error getting crafted image:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

export default getCraftedImageHandler;