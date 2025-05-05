import User from "../models/users.model.js";
// import sendMail  from "../utils/sendMail.js";

//Create users
const createUser = async (req, res) => {
  try {
    const { username, email, fullname, password } = req.body;
    const newUser = new User({ username, email, fullname, password });
    const savedUser = await newUser.save();

    // await sendMail({
    //   to: email,
    //   subject: 'Welcome to Our App!',
    //   text: `Hi ${fullname}, welcome to our platform.`,
    //   html: `<p>Hi <strong>${fullname}</strong>,</p><p>Welcome to our app!</p>`,
    // });

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error. Could not fetch users." });
  }
};

//Update user
const updateUser = async(req, res) => {
  try {
   const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
	 res.status(200).json(updateUser)
	}catch (error){
    console.error("Error updating users:", error);
		res.status(500).json({ message: "Server error, Could not update users."})
	}
};

//Delete User
const deleteUser = async(req, res) =>{
	try{
   const deleteUser = await User.findByIdAndDelete(req.params.id)
	 res.json({ message: "User deleted" });
	}catch (error){
   console.error("Error deleteing user", error);
	 res.status(500).json({message: "Server Error, Not deleteing user"})
	}
}

//User By Id
const getUserById = async(req, res) =>{
	try{  
		const user = await User.findById(req.params.id)
		if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
		res.status(200).json(user);
	}catch (error){
		console.error("Error dgeting user", error);
		res.status(500).json({message: "Server Error, Not user"})
	}
}

export { createUser, getAllUsers, updateUser, deleteUser, getUserById}