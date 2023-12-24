import {MongoClient} from "mongodb";

const { MONGO_URL, MONGO_DB_NAME } = process.env;

const getCraftedImageByIdHandler = async (req, res) => {
  let client;

  try {
    client = new MongoClient(MONGO_URL);

    await client.connect();
    const db = client.db(MONGO_DB_NAME);
    const craftedImagesCollection = db.collection('craftedImages');

    const craftedImageId = req.params.craftedImageId;

    const craftedImage = await craftedImagesCollection.findOne({ _id: craftedImageId });

    if (craftedImage) {
      res.status(200).json(craftedImage);
    } else {
      res.status(404).json({ error: 'Crafted image not found' });
    }
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default getCraftedImageByIdHandler;