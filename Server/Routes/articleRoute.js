const express = require("express");
const router = express.Router();
const articleModel = require("../Models/articleModel");
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

// GET all articles
router.get("/", async (req, res) => {
    try {
      const data = await articleModel.find()
      .populate({
        path: 'name',
      });
      
      if (!data || data.length === 0) {
        return res.status(404).json({ error: "No articles found" });
      }
      
      const responseData = data.map(doc => ({
        name: doc.name.name,
        title: doc.title,
        description: doc.description,
        image: doc.image,
        postedTime: doc.postedTime
      }));
      
      res.json(responseData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "500-Internal server error" });
    }
  });

  // GET specific article by ID
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const data = await articleModel.findById(id);
      if (!data) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // GET specific articles by USER ID
  router.get("/userArticles/:id", async (req, res) => {
    const id = req.params.id;
  
    try {
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

  
      const profileID = user.profile;
      const profile = await profileModel.findById(profileID).populate("articles").exec();
  
      const articles = profile.articles;
      const responseData = articles.map(article => ({
        name: user.name,
        title: article.title,
        description: article.description,
        image: article.image,
        postedTime: article.postedTime
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
      
      const newArticleData = {
        name: profile._id,
        title,
        description,
        image: image,
      };
      
      const newArticle = new articleModel(newArticleData);
      const savedArticle = await newArticle.save();
      
      profile.articles.push(savedArticle._id);
      await profile.save();
      
      const populatedProfile = await profileModel.findById(profile._id).populate("articles").exec();
      res.status(201).json(populatedProfile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  
  
  
  module.exports = router;