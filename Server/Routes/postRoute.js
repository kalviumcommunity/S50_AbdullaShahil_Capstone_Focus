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
  category: Joi.string().required(),
});

const patchJoiSchema = Joi.object({
  name: Joi.string(),
  title: Joi.string(),
  description: Joi.string(),
  image: Joi.string(),
  category: Joi.string(),
  action: Joi.string().valid('like', 'unlike'),
  profileID: Joi.string()
}).min(1);

function validatePatch(req, res, next) {
  const { error } = patchJoiSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

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
      _id: doc._id,
      name: doc.name.name,
      title: doc.title,
      description: doc.description,
      image: doc.image,
      category: doc.category,
      likes: doc.likes,
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
      image: post.image,
      category: post.category,
      likes: post.likes,
    }));

    res.json(responseData);

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


// PATCH to update likes in a post
router.patch("/like/:id", validatePatch, async (req, res) => {
  const postId = req.params.id;
  console.log(req.body)
  const { action, profileID } = req.body;

  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let updatedPost;

    if (action === "like") {
      if (!post.likes.includes(profileID)) {

        updatedPost = await postModel.findByIdAndUpdate(
          postId,
          { $addToSet: { likes: profileID } },
          { new: true }
        );

        console.log("added like")
      } else {
        return res.status(400).json({ message: "You already liked this post" });
      }
    } else if (action === "unlike") {
      if (post.likes.includes(profileID)) {
        updatedPost = await postModel.findByIdAndUpdate(
          postId,
          { $pull: { likes: profileID } },
          { new: true }
        );
        console.log("removed like")
      } else {
        return res.status(400).json({ message: "You haven't liked this post" });
      }
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// POSTING - along with populating in profile
router.post("/", validatePost, async (req, res) => {
  try {
    const { title, description, name, image, category } = req.body;

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
      image: image,
      category: category,
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
