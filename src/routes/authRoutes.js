import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from '../models/users.model.js'
import verifyToken from "../middlewares/auth.js";
const router = Router()

//Register Route
router.post('/register', async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email});
    if (existingUser) return res.status(400).json({ error: "Alreday exist"});
    
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword
    })
    await newUser.save();
    res.status(201).json({message: "User resgister successfully"});
  }catch(error){
    console.error(error);
   res.status(500).json({error: "Internal Server error"})
  }
});

export default router;