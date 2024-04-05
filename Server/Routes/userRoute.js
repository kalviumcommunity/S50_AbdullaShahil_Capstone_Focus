const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const userModel = require("../Models/userModel");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const profileModel = require("../Models/profileModel");
const { Cookie } = require("express-session");
require('dotenv').config()

router.use(express.json());

const generateToken = (user) => {
    return jwt.sign({ user: user }, process.env.SECRET_KEY, { expiresIn: "2h" })
}

const userJoiSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const putUserJoiSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string(),
}).min(1);

const patchUserJoiSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string(),
}).min(1);

function validateUser(req, res, next) {
    const { error } = userJoiSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

function validatePutUser(req, res, next) {
    const { error } = putUserJoiSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

function validatePatchUser(req, res, next) {
    const { error } = patchUserJoiSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Token is not provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.decoded = decoded;
        next();
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error1: "Forbidden: Failed to authenticate token",error });
    }
};


// GET each user by token
router.post("/getUser", verifyToken, async (req, res) => {
    try {
        const userId = req.decoded.user._id;
        const user = await userModel.findById(userId);
        console.log(user)
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ valid: true, user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// GET all users
router.get("/users", async (req, res) => {
    try {
        const data = await userModel.find();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "500-Internal server error" });
    }
});

// GET each user by ID
router.get("/users/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await userModel.findById(id);
        if (!data) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


// POST a new user
router.post("/users", validateUser, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const profile = (await profileModel.create({ name: name, email }));
        const newUser = await userModel.create({
            name: name,
            email: email,
            password: hashedPassword,
            profile: profile._id
        });
        const token = generateToken(newUser);

        res.status(201).json({ userData: newUser, token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// VALIDATE TOKEN
router.post("/users/tokenvalidate", verifyToken, (req, res) => {
    res.status(200).json({ valid: true, user: req.decoded });
});


// POST REQUEST FOR LOGIN - TO CHECK IF THE EMAIL AND PASSWORD MATCHES
router.post("/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).populate("profile").exec();
        if (!user) {
            return res.status(401).json({ error: "Invalid email" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const token = generateToken(user);
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        res.status(201).json({ email: user.email, name: user.name, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});



// PUT to update a user
router.put("/users/:id", validatePutUser, async (req, res) => {
    const userId = req.params.id;
    const updatedUserData = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Update user
        const updatedUser = await userModel.findByIdAndUpdate(userId, updatedUserData, { new: true }).session(session);
        if (!updatedUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: "User not found" });
        }

        // Update profile
        if (updatedUser.profile) {
            const updateProfile = await profileModel.findByIdAndUpdate(updatedUser.profile._id, updatedUserData, { new: true }).session(session);
            if (!updateProfile) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ error: "Profile not found" });
            }
        } else {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: "Profile not found" });
        }

        await session.commitTransaction();
        session.endSession();

        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: "Internal server error" });
    }
});





// PATCH to partially update a user
router.patch("/users/:id", validatePatchUser, async (req, res) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// DELETE a user
router.delete("/users/:id", async (req, res) => {
    try {
        const deletedUser = await userModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
