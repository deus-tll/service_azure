import {MongoClient} from "mongodb";

const { MONGO_URL, MONGO_DB_NAME } = process.env;

const getInitialUser = async (req, res) => {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    const db = client.db(MONGO_DB_NAME);
    const usersCollection = db.collection('users');

    const initialUser = await usersCollection.findOne({});
    res.json(initialUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
};

export default getInitialUser;