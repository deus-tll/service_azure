import express from 'express';
import { MongoClient } from 'mongodb';
import {v4} from 'uuid';


const app = express();
const port = 80;
const url = process.env.MONGO_URL;
const dbName = process.env.MONGO_DB_NAME;


app.use(express.json());


async function initializeDatabase() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    const usersCount = await usersCollection.countDocuments({});

    if (usersCount === 0) {
      const initialUser = {
        id: v4(),
        name: 'John Doe',
        email: 'john_doe@gmail.com',
        password: 'securepassword'
      };

      await usersCollection.insertOne(initialUser);
      console.log('Initial user added:', initialUser);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await client.close();
  }
}


app.get('/api/database/manager/getInitialUser', async (req, res) => {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    const initialUser = await usersCollection.findOne({});
    res.json(initialUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});


await initializeDatabase();

app.listen(port, () => {
  console.log(`Database service listening at http://localhost:${port}`);
});