const express = require("express");
const router = express.Router();
const articleModel = require("../Models/articleModel");
const profileModel = require("../Models/profileModel");
const Joi = require("joi");

router.use(express.json());

const postJoiSchema = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().uri().required(),
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
      _id: doc._id,
      name: doc.name.name,
      title: doc.title,
      description: doc.description,
      image: doc.image,
      postedTime: doc.postedTime,
      likes: doc.likes,
      category: doc.category,
      profile_img: doc.profile_img

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
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET specific articles by Profile ID
router.get("/userArticles/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id)
  try {
    const profile = await profileModel.findById(id).populate("articles").exec();

    const articles = profile.articles;

    const responseData = articles.map(article => ({
      _id: article._id,
      name: article.name,
      title: article.title,
      description: article.description,
      image: article.image,
      postedTime: article.postedTime,
      likes: article.likes,
      category: article.category
    }));
    console.log(responseData)
    res.json(responseData);

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET comments of a specific article
router.get("/comments/:id", async (req, res) => {
  const articleId = req.params.id;
  try {
    const article = await articleModel.findById(articleId);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const responseData = article.comments
    res.json(responseData);

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST REQUESTS

// Function to validate URL 
function validateUrlFormat(url) {
  const regex = /^(ftp|http|https):\/\/[^ "]+$/;
  return regex.test(url);
}

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

    const isValidUrl = validateUrlFormat(image);
    if (!isValidUrl) {
      return res.status(400).json({ error: "Invalid image URL format" });
    }

    const newArticleData = {
      name: profile._id,
      title,
      description,
      image: image,
      category: category,
      profile_img: profile.profile_img
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



// POST a comment on a article
router.post('/comments/:articleId', async (req, res) => {
  try {
    const { name, message, profilepic } = req.body;

    const article = await articleModel.findById(req.params.articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const newComment = {
      name: name,
      message: message,
      profilepic: profilepic,
      postedTime: Date.now()
    };
    article.comments.push(newComment);
    await article.save();

    const addedComment = article.comments[article.comments.length - 1];
    console.log(addedComment)
    res.status(201).json(addedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// PATCH/PUT REQUESTS


// PATCH to update likes in a article
router.patch("/like/:id", validatePatch, async (req, res) => {
  const articleId = req.params.id;
  console.log(req.body);
  const { action, profileID } = req.body;

  try {
    const article = await articleModel.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    let updatedArticle;

    if (action === "like") {
      if (!article.likes.includes(profileID)) {
        updatedArticle = await articleModel.findByIdAndUpdate(
          articleId,
          { $addToSet: { likes: profileID } },
          { new: true }
        ).populate('name', 'name')


        console.log("added like");
      } else {
        return res.status(400).json({ message: "You already liked this article" });
      }
    } else if (action === "unlike") {
      if (article.likes.includes(profileID)) {
        updatedArticle = await articleModel.findByIdAndUpdate(
          articleId,
          { $pull: { likes: profileID } },
          { new: true }
        ).populate('name', 'name')

        console.log("removed like");
      } else {
        return res.status(400).json({ message: "You haven't liked this article" });
      }
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    const responseData = {
      _id: updatedArticle._id,
      name: updatedArticle.name.name,
      title: updatedArticle.title,
      description: updatedArticle.description,
      image: updatedArticle.image,
      category: updatedArticle.category,
      likes: updatedArticle.likes,
    };
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// PUT to update an article
router.put("/:id", async (req, res) => {
  try {
    const updatedArticle = await articleModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(updatedArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// DELETE REQUESTS

// DELETE an article
router.delete("/:id", async (req, res) => {
  try {
    const articleID = req.params.id
    const { profileid } = req.headers;

    if (!profileid) {
      return res.status(400).json({ error: "Profile ID is required" });
    }


    // Find the profile by ID
    const profile = await profileModel.findById(profileid);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const deletedArticle = await articleModel.findByIdAndDelete(articleID);
    if (!deletedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Remove the article ID from the profile ---> articles array
    profile.articles = profile.articles.filter(id => id.toString() !== articleID);
    await profile.save();

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// DELETE a comment on a article
router.delete('/comments/delete/:articleId', async (req, res) => {
  try {
    const { commentId } = req.query;

    const article = await articleModel.findById(req.params.articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    article.comments.pull({ _id: commentId });
    await article.save();

    console.log("Comment deleted")
    res.status(200).json({ message: 'Comment deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;