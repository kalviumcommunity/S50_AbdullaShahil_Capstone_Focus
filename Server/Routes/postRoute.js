const express = require("express");
const router = express.Router();
const postModel = require("../Models/postModel");
const profileModel = require("../Models/profileModel");
const Joi = require("joi");

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

// POST a new post with validation
router.post("/posts", validatePost, async (req, res) => {
  try {
    const newpost = new postModel(req.body);
    const result = await newpost.save();
    await profileModel.findOneAndUpdate(
      { id: req.body.id },
      { $push: { posts: result._id } },
      { new: true }
    ).populate("posts").exec();
    console.log(req.body)
    console.log(req.body)

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = router;