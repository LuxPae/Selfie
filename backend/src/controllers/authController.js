const User = require("../models/User");
const Token = require("../models/Token");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs")

exports.register = async (req, res) => {
  console.log("\nNew registration: ", req.body);
  try {
    const { email, password, username, fullName } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      console.log("User already exists");
      return res.status(400).json({ message: "Esiste già un utente associato a questo indirizzo email" });
    }

    user = new User({ email, password, username, fullName });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { userID: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    const tokenDocument = new Token({ userID: user._id, token });
    await tokenDocument.save();

    res.json({ token });
    console.log("> Registration was successfull");
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  console.log("\nLogin:", req.body);
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      console.log("x Incorrect email or missing account");
      res.status(400).json({ message: "Non esiste un account associato a questo indirizzo email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("x Incorrect password");
      res.status(400).json({ message: "Password non corretta" });
    }

    const payload = { userID: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    const tokenDocument = new Token({ userID: user._id, token });
    await tokenDocument.save();

    res.json({ token });
    console.log("> Login was successfull");
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
  }
};

exports.logout = async (req, res) => {
  console.log("\nLogging out");
  try {
    const { token } = req.body;

    let tokens = await Token.find({ token });
    if (tokens) await Token.deleteMany({ token });

    res.status(200).json({ message: "Logged out successfully" });
    req.user = null;
    console.log("> Logout was successfull");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getAuthToken = () => localStorage.getItem("token");

exports.isAuthenticated = () => {
  const token = getAuthToken();
  const expiry = localStorage.getItem("token_expiration")
  const expired = (dayjs().valueOf() - expiry) > 60*60*1000
  return !!token && !expired
}
exports.clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("token_expiration");
}
