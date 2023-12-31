import {MongoClient} from "mongodb";

const { MONGO_URL, MONGO_DB_NAME } = process.env;

const getCraftedImagesByUserIdHandler = async (req, res) => {
  let client;

  try {
    client = new MongoClient(MONGO_URL);

    await client.connect();
    const db = client.db(MONGO_DB_NAME);
    const craftedImagesCollection = db.collection('craftedImages');

    const userId = req.params.userId;

    const craftedImages = await craftedImagesCollection.find({ userId }).toArray();

    res.status(200).json(craftedImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
};

export default getCraftedImagesByUserIdHandler;