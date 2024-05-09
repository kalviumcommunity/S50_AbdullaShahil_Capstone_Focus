const express = require("express");
const router = express.Router();
const postModel = require("../Models/postModel");
const profileModel = require("../Models/profileModel");
const userModel = require("../Models/userModel");
const Joi = require("joi");

router.use(express.json());

const postJoiSchema = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
});

function validatePost(req, res, next) {
  const { error } = postJoiSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

// GET all posts
router.get("/", async (req, res) => {
  try {
    const data = await postModel.find()
      .populate({
        path: 'name',
      });

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No posts found" });
    }

    const responseData = data.map(doc => ({
      name: doc.name.name,
      title: doc.title,
      description: doc.description,
      image: doc.image
    }));

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "500-Internal server error" });
  }
});


// GET specific post by ID
router.get("/:id", async (req, res) => {
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

// GET specific post by USER ID
router.get("/userPosts/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const profileID = user.profile;
    const profile = await profileModel.findById(profileID).populate("posts").exec();

    const posts = profile.posts;
    const responseData = posts.map(post => ({
      name: post.name.name,
      title: post.title,
      description: post.description,
      image: post.image
    }));

    res.json(responseData);

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});




// POSTING - along with populating in profile
router.post("/", validatePost, async (req, res) => {
  try {
    const { title, description, name, image } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name not provided" });
    }

    const profile = await profileModel.findOne({ name });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const newPostData = {
      name: profile._id,
      title,
      description,
      image: image
    };

    const newPost = new postModel(newPostData);
    const savedPost = await newPost.save();

    profile.posts.push(savedPost._id);
    await profile.save();

    const populatedProfile = await profileModel.findById(profile._id).populate("posts").exec();
    res.status(201).json(populatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});




module.exports = router;
