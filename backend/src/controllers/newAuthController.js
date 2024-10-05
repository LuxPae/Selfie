const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (_id) => jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" }); 

const registerUser = async (req, res) => {
  const body = req.body;

  try {
    const exists = await User.findOne({ email: body.email });

    //TODO da togliere ?
    if (!body.fullName || !body.email || !body.password || !body.username) {
      throw new Error("Riempi tutti i campi");
    }

    //TODO da fare a mano
    //if (!validator.isEmail(body.email)) throw new Error("Validation: Email is not valid");
    //if (!validator.isStrongPassword(body.password)) throw new Error("Validation: Password is not strong enough");

    if (exists) throw new Error("Validation: Email already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const newUser = new User({
      email: body.email,
      password: hashedPassword,
      fullName: body.fullName,
      username: body.username
    });
    console.log("\nRegistering user", newUser.email);

    const newEntry = await newUser.save();
    const token = createToken(newEntry._id);

    res.status(201).json({
      _id: newEntry._id.toString(),
      email: newEntry.email,
      username: newEntry.username,
      fullName: newEntry.fullName,
      picture: newEntry.picture,
      bio: newEntry.bio,
      createdAt: newEntry.createdAt,
      updatedAt: newEntry.updatedAt,
      token 
    });
    console.log("> Register successfull");
  } catch (error) {
    if (error.message.split(':')[0] === "Validation") {
      res.status(400).json({ message: error.message });
      console.log(" x Registration failed");
    }
    else {
      console.error("Internal Server Error:", error);
      res.status(500).json({ message: "500 Internal Server Error, User not created" });
    }
  }
};

const loginUser = async (req, res) => {
  console.log("\nLogging user", req.body.email)
  try {
    const login = await User.findOne({ email: req.body.email });

    if (!login) {
      console.log("x No account associated")
      res.status(404).json({ message: "Email non trovata" });
      return;
    }

    const validPassword = await bcrypt.compare(req.body.password, login.password);

    if (!validPassword) {
      console.log("x Invalid password")
      res.status(400).json({ message: "Password errata" });
      return;
    }

    const _id = login._id.toString();
    const token = createToken(_id);

    const user = {
      _id,
      email: login.email,
      username: login.username,
      fullName: login.fullName,
      picture: login.picture,
      bio: login.bio,
      createdAt: login.createdAt,
      updatedAt: login.updatedAt,
      token 
    }
    console.log("> User logged successfully")
    //console.log("  ", user)
    res.status(200).json(user);
  } catch (error) {
    console.log("x "+error.message);
    res.status(500).json({ message: "500 Internal Server Error, User not logged in" });
  }
};

module.exports = { registerUser, loginUser }
