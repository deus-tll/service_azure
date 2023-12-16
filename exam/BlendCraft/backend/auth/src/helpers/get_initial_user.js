import jwt from "jsonwebtoken";
import axios from "axios";

const axiosDatabase = axios.create({
  baseURL: 'http://api.database.manager',
});

const getInitialUser = async (req, res) => {
  try {
    const response = await axiosDatabase.get('/api/database/manager/get_initial_user');
    const initialUser = response.data;

    const token = jwt.sign({ user: initialUser }, process.env.JWT_KEY);

    res.status(200).json({ accessToken: token, user: initialUser });
  } catch (error) {
    console.error('Error getting initial userActions and token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default getInitialUser;