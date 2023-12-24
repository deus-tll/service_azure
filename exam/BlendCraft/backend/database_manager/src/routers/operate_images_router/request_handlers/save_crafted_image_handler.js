import {MongoClient} from "mongodb";

const { MONGO_URL, MONGO_DB_NAME } = process.env;

const saveCraftedImageHandler = async (req, res) => {
  let client;

  try {
    client = new MongoClient(MONGO_URL);

    await client.connect();
    const db = client.db(MONGO_DB_NAME);
    const craftedImagesCollection = db.collection('craftedImages');

    const craftedImage = req.body;

    const result = await craftedImagesCollection.insertOne(craftedImage);
    console.log('CraftedImage saved:', craftedImage);

    if (result.insertedId) {
      const insertedId = result.insertedId;

      console.log('CraftedImage saved with ID:', insertedId);
      res.status(201).json({ message: 'CraftedImage saved successfully', insertedId });
    } else {
      res.status(500).json({ error: 'Failed to save CraftedImage' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
};

export default saveCraftedImageHandler;