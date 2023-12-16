import {MongoClient} from "mongodb";

const { MONGO_URL, MONGO_DB_NAME } = process.env;

const saveCraftedImageHandler = async (req, res) => {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    const db = client.db(MONGO_DB_NAME);
    const craftedImagesCollection = db.collection('craftedImages');

    const craftedImage = req.body;
    await craftedImagesCollection.insertOne(craftedImage);
    console.log('CraftedImage saved:', craftedImage);

    res.json({ message: 'CraftedImage saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
};

export default saveCraftedImageHandler;