import jwt from "jsonwebtoken";


const JWT_KEY = process.env.JWT_KEY;


export const generateToken = (user) => {
  const expiresInWeek = 7 * 24 * 60 * 60; // 7 днів в секундах
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInWeek;

  return jwt.sign(
    {
      iss: 'auth-microservice',
      user: user,
      expiresAt: expiresAt
    },
    JWT_KEY
  );
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_KEY);

    if (decoded.expiresAt < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return decoded;
  }
  catch (error) {
    return null;
  }
};

export const createResultObject = (user, token) => {
  return {
    "user": user,
    "token": token
  };
};