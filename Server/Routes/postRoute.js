const express = require("express");
const router = express.Router();
const postModel = require("../Models/postModel");
const profileModel = require("../Models/profileModel");
const Joi = require("joi");

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.use(express.json());

const postJoiSchema = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  imageUrl: Joi.string().uri(),
});

function validatePost(req, res, next) {
  const { error } = postJoiSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

// GET all posts
router.get("/posts", async (req, res) => {
  try {
    const data = await postModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "500-Internal server error" });
  }
});

// GET specific post by ID
router.get("/posts/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await postModel.findById(id);
    if (!data) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


// POSTING - along with populating in profile
router.post("/posts", validatePost, async (req, res) => {
  try {
    const { error } = postJoiSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const newPost = new postModel(req.body);
    const result = await newPost.save();

    const name = req.body.name;
    if (name) {
      await profileModel.findOneAndUpdate(
        { name },
        { $push: { posts: result._id } },
        { new: true }
      );
      const data = await profileModel.findOne({ name }).populate("posts").exec();
      res.status(201).json(data);
    } else {
      res.status(400).json({ error: "Name not provided" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});




module.exports = router;