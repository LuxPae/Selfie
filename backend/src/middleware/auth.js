const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tokenDocument = await Token.findOne({ token });

    if (!tokenDocument) {
      throw new Error();
    }

    req.user = { id: decoded.userID };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

const middleware_test = async (req, res, next) => {
  console.log("Middleware per testare");
  next();
}

module.exports = { auth, middleware_test };
