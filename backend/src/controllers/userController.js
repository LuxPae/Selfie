const User = require("../models/User.js")

exports.getAllUsers = async (req, res) => {
  console.log("\nFetching all users");
  try {
    const users = await User.find({});
    res.json(users);
  }
  catch (e) {
    console.error(e.message);
    res.status(500).send("Server error")
  }
}

exports.getUser = async (req, res) => {
  console.log("\nFetching user");
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}

exports.getUserById = async (req, res) => {
  const id = req.params._id;
  console.log("\nFetching user with ID:", id);
  try {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    res.status(200).json(user);
  }
  catch (error) {
    console.error(error.message);
    return res.status(404).json({ message: "User not found" });
  }
}

exports.modifyUser = async (req, res) => {
  console.log("\nModifying user");
  try {
    const modified_user = req.body.modified_user;
    //console.log("Changes:", modified_user);
    const new_user = await User.findOneAndUpdate({ _id: modified_user._id}, modified_user);
    await new_user.save();
    //console.log("New user:", new_user);
    if (!new_user) throw new Error("User could not be modified")
    res.status(204).json({ message: "User modified" });
    req.user = null;
  }
  catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
}

exports.deleteUser = async (req, res) => {
  const id = req.params._id;
  console.log("\nDeleting user", id);
  try {
    const user = await User.findById(id); 
    if (user) {
      await User.deleteOne({ email: user.email });
      console.log("User deleted");
      res.status(204).json({ message: "User deleted" })
    }
    else throw new Error("User does not exist?")
  }
  catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}
