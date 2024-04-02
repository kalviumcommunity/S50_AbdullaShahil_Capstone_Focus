const express = require("express");
const router = express.Router();
const postModel = require("../Models/postModel");
const profileModel = require("../Models/profileModel");
const Joi = require("joi");
const multer = require('multer');
const fs = require("fs");

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
    const data = await postModel.find();

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No posts found" });
    }
    
    const responseData = data.map(doc => ({
      name: doc.name,
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
    const bf = Buffer.from(req.file.buffer, "utf-8");
    fs.writeFileSync("./b.png", bf)

    const newPostData = {
      name: req.body.name,
      title: req.body.title,
      description: req.body.description,
      image: req.file.buffer
    };

    const newPost = new postModel(newPostData);
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
