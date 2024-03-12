const express = require("express");
const router = express.Router();
const userModel = require("../Models/userModel");
require('dotenv').config()

router.use(express.json());


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
router.post("/users", async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await userModel.create(userData);
        res.status(201).json({ userData: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// PUT to update a user
router.put("/users/:id", async (req, res) => {
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
router.patch("/users/:id", async (req, res) => {
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
