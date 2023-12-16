import {MongoClient} from "mongodb";
import {v4} from "uuid";

const { MONGO_URL, MONGO_DB_NAME } = process.env;

const initializeDatabase = async () => {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    const db = client.db(MONGO_DB_NAME);
    const usersCollection = db.collection('users');

    const usersCount = await usersCollection.countDocuments({});

    if (usersCount === 0) {
      const initialUser = {
        _id: v4(),
        name: 'John Doe',
        email: 'john_doe@gmail.com',
        password: 'password'
      };

      await usersCollection.insertOne(initialUser);
      console.log('Initial userActions added:', initialUser);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await client.close();
  }
}

export default initializeDatabase;