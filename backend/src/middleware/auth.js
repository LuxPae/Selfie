const jwt = require("jsonwebtoken");
const User = require("../models/User")

const auth = async (req, res, next) => {
  if (req.path === "/auth/login" || req.path === "/auth/register") return next()

  console.log("\nAuthenticating user");

  const { authorization } = req.headers;
  if (!authorization) throw new Error("Token di autorizzazione necessario")

  const token = authorization.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedToken;
    const authenticated_user = await User.findOne({ _id }).select("_id");
    req.user = { _id: authenticated_user._id.toString(), token };
    console.log("> User authenticated")
    next();
  } catch (error) {
    console.log("x Error while authenticating:", error)
    res.status(401).json({ message: "Request needs authentication" });
  }
};

module.exports = { auth };
