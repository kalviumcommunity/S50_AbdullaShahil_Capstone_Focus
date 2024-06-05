const express = require("express");
const router = express.Router();
const Joi = require("joi");

const communityModel = require("../Models/communityModel");
const profileModel = require("../Models/profileModel");
const userModel = require("../Models/userModel");

router.use(express.json());

// GET ALL COMMUNITIES
router.get("/", async (req, res) => {
  try {
    const data = await communityModel.find()
      .populate('admin', 'name') 
      .exec();

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No communities found" });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "500 - Internal server error" });
  }
});

// CREATE A NEW COMMUNITY
router.post("/", async (req, res) => {
  try {
    const { name, description, profileImg, admin } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name not provided" });
    }

    const profile = await profileModel.findById(admin);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const newCommunityData = {
      name: name,
      admin: profile._id,
      description: description,
      profileImg: profileImg, 
    };

    const newCommunity = new communityModel(newCommunityData);
    const savedCommunity = await newCommunity.save();

    profile.communities.push(savedCommunity._id);
    await profile.save();

    const populatedProfile = await profileModel.findById(profile._id)
      .populate("communities")
      .exec();

    res.status(201).json(populatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "500 - Internal server error" });
  }
});

module.exports = router;
