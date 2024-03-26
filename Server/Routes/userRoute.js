const express = require("express");
const router = express.Router();
const userModel = require("../Models/userModel");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const profileModel = require("../Models/profileModel");
const { Cookie } = require("express-session");
require('dotenv').config()

router.use(express.json());

const generateToken = (user) => {
    return jwt.sign({ name: user.username }, process.env.SECRET_KEY, { expiresIn: "2h" })
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


const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.status(200).json({ error: "Token is not provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.decoded = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Failed to authenticate token" });
    }
};

// VALIDATE TOKEN
router.post("/users/tokenvalidate", verifyToken, (req, res) => {
    res.status(200).json({ valid: true, user: req.decoded });
});


// POST REQUEST FOR LOGIN - TO CHECK IF THE EMAIL AND PASSWORD MATCHES
router.post("/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).populate("profile").exec();
        console.log("while login", user);
        if (!user) {
            return res.status(401).json({ error: "Invalid email" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = generateToken(user);
        res.status(201).json({ email: user.email, name: user.name, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});



// PUT to update a user
router.put("/users/:id", validatePutUser, async (req, res) => {
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
