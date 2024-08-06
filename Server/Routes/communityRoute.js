const express = require("express");
const router = express.Router();
const Joi = require("joi");

const communityModel = require("../Models/communityModel");
const personalMessageModel = require("../Models/personalMessageModel");

const profileModel = require("../Models/profileModel");
const userModel = require("../Models/userModel");
const messageModel = require("../Models/messageModel")

router.use(express.json());

// GET ALL COMMUNITIES
router.get("/", async (req, res) => {
  try {
    const communities = await communityModel.find()
      .populate('admin', 'name')
      .populate('members', 'name')
      .lean();

    if (!communities || communities.length === 0) {
      return res.status(404).json({ error: "No communities found" });
    }

    const responseData = communities.map(community => ({
      _id: community._id,
      name: community.name,
      members: community.members.map(member => ({
        _id: member._id,
        name: member.name
      })), 
      profileImg: community.profileImg,
      admin: {
        _id: community.admin._id,
        name: community.admin.name
      },
      description: community.description
    }));

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "500 - Internal server error" });
  }
});

// GET A SINGLE COMMUNITY
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const community = await communityModel.findById(id)
      .populate('admin', 'name')
      .populate('members', 'name')
      .lean();

    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    res.json(community);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "500 - Internal server error" });
  }
});


// GET PERSONAL MESSAGES
router.get("/messages/personalMessages/:otherUserId", async (req, res) => {
  const { userId } = req.query;
  const { otherUserId } = req.params;
  const parsedUserId = JSON.parse(userId);
  
  const currentUserId = parsedUserId._id;

  const room = [currentUserId, otherUserId].sort().join("_");

  try {
    const personalMessages = await personalMessageModel.findOne({ room });
    res.json(personalMessages ? personalMessages.messages : []);
  } catch (error) {
    console.error("Error fetching personal messages:", error);
    res.status(500).send("Error fetching personal messages");
  }
});



// GET COMMUNITY LISTS (NAME, PROFILE IMG AND ID)
router.get("/list/displayData", async (req, res) => {
  try {
    const communities = await communityModel.find()
      .select('_id name profileImg')
      .lean();

    if (!communities || communities.length === 0) {
      return res.status(404).json({ error: "No communities found" });
    }

    res.json(communities);

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


// ADD MEMBERS
router.patch("/addMember/:id", async (req, res) => {
  try {
    const communityId = req.params.id;
    const userId = req.body.userId;

    const community = await communityModel.findById(communityId);
    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const profileId = user.profile;
    const profile = await profileModel.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    if (community.members.includes(profileId)) {
      return res.status(400).json({ error: "User is already a member of the community" });
    }

    community.members.push(profileId);
    profile.communities.push(communityId);

    await community.save();
    await profile.save();

    console.log("User added to community")
    res.status(200).json({ message: "User added to community successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "500 - Internal server error" });
  }
});

// DELETE a Community
router.delete("/:id", async (req, res) => {
  try {
    const communityId = req.params.id
      const deletedCommunity = await communityModel.findByIdAndDelete(communityId);
      if (!deletedCommunity) {
          return res.status(404).json({ message: "Community not found" });
      }
      res.json({ message: "Community deleted successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
