import jwt from "jsonwebtoken";

const getUserIdFromToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decodedToken.user._id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default getUserIdFromToken;