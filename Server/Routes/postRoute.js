const express = require("express");
const router = express.Router();
const postModel = require("../Models/postModel");
const profileModel = require("../Models/profileModel");
const Joi = require("joi");
const multer = require('multer');

router.use(express.json());

const postJoiSchema = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string(),
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
    const data = await postModel.find()
    .populate({
      path: 'name',
    });

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No posts found" });
    }
    
    const responseData = data.map( doc => ({
      name: doc.name.name,
      title: doc.title,
      description: doc.description,
      image: doc.image.toString('base64')
    }));

    res.json(responseData);
  } catch (error) {
    console.error(error);
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

const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix + file.originalname)
  }
});

const upload = multer({ storage: storage });

// POSTING - along with populating in profile
router.post("/posts", upload.single("image"), validatePost, async (req, res) => {
  try {
    const { title, description, name } = req.body;

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
      image: req.file.buffer
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
