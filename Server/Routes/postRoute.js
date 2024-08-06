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


// GET REQUESTS


// GET all posts
router.get("/", async (req, res) => {
  try {
    const posts = await postModel.find().lean();

    if (!posts || posts.length === 0) {
      return res.status(404).json({ error: "No posts found" });
    }

    const profileIds = posts.map(post => post.name);

    const profiles = await profileModel.find({ _id: { $in: profileIds } }).lean();

    const profileMap = {};
    profiles.forEach(profile => {
      profileMap[profile._id] = profile.name;
    });
    console.log(posts)

    const responseData = posts.map(post => ({
      _id: post._id,
      name: profileMap[post.name] || 'Unknown',
      title: post.title,
      description: post.description,
      image: post.image,
      category: post.category,
      likes: post.likes,
      profile_img: post.profile_img
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

    const profile = await profileModel.findById(id).populate("posts").exec();

    const posts = profile.posts;
    
    const responseData = posts.map(post => ({
      _id: post._id,
      name: post.name.name,
      title: post.title,
      description: post.description,
      image: post.image,
      category: post.category,
      likes: post.likes,
      profile_img: post.profile_img
    }));

    res.json(responseData);

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


// GET comments of a specific post
router.get("/comments/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const responseData = post.comments
    res.json(responseData);

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});



// POST REQUESTS


// POST a comment on a post
router.post('/comments/:postId', async (req, res) => {
  try {
    const { name, message, profilepic } = req.body;

    const post = await postModel.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      name: name,
      message: message,
      profilepic: profilepic,
      postedTime: Date.now()
    };
    post.comments.push(newComment);
    await post.save();

    const addedComment = post.comments[post.comments.length - 1];
    console.log(addedComment)
    res.status(201).json(addedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      profile_img: profile.profile_img
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



// PATCH/PUT REQUESTS

// PATCH to update likes in a post
router.patch("/like/:id", validatePatch, async (req, res) => {
  const postId = req.params.id;
  console.log(req.body);
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
        ).populate('name', 'name')


        console.log("added like");
      } else {
        return res.status(400).json({ message: "You already liked this post" });
      }
    } else if (action === "unlike") {
      if (post.likes.includes(profileID)) {
        updatedPost = await postModel.findByIdAndUpdate(
          postId,
          { $pull: { likes: profileID } },
          { new: true }
        ).populate('name', 'name')

        console.log("removed like");
      } else {
        return res.status(400).json({ message: "You haven't liked this post" });
      }
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    const responseData = {
      _id: updatedPost._id,
      name: updatedPost.name.name,
      title: updatedPost.title,
      description: updatedPost.description,
      image: updatedPost.image,
      category: updatedPost.category,
      likes: updatedPost.likes,
      profile_img: updatedPost.profile_img
    };
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT to update a post
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await postModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// DELETE REQUESTS

// DELETE a comment on a post
router.delete('/comments/delete/:postId', async (req, res) => {
  try {
    const { commentId } = req.query;

    const post = await postModel.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.pull({ _id: commentId });
    await post.save();
    console.log("Comment deleted")
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// DELETE a post
router.delete("/:id", async (req, res) => {
  try {
    const postID = req.params.id
    const { profileid } = req.headers;

    if (!profileid) {
      return res.status(400).json({ error: "Profile ID is required" });
    }


    // Find the profile by ID
    const profile = await profileModel.findById(profileid);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const deletedPost = await postModel.findByIdAndDelete(postID);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Remove the post ID from the profile ---> posts array
    profile.posts = profile.posts.filter(id => id.toString() !== postID);
    await profile.save();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;