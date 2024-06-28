const express = require("express");
const router = express.Router();
const Joi = require("joi");

const communityModel = require("../Models/communityModel");
const messageModel = require("../Models/messageModel")

router.use(express.json());

// GET ALL MESSAGES IN A COMMUNITY
router.get("/community/:id", async (req, res) => {
  try {
    communityID = req.params.id
    const messages = await messageModel.findOne({communityId: communityID})

    if (!messages || messages.length === 0) {
      return res.status(404).json({ error: "No messages found" });
    }

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "500 - Internal server error" });
  }
});



module.exports = router;
