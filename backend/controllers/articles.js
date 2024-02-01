const articlesModel = require("../models/articles");

// This function returns the articles
const getAllArticles = (req, res) => {
  const userId = req.token.userId;
  articlesModel
    .find()
    .populate("comments")
    .exec()
    .then((articles) => {
      if (articles.length) {
        res.status(200).json({
          success: true,
          message: `All the articles`,
          userId: userId,
          articles: articles,
        });
      } else {
        res.status(200).json({
          success: false,
          message: `No Articles Yet`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

//This function returns articles by author
const getArticlesByAuthor = (req, res) => {
  let authorId = req.query.author;

  articlesModel
    .findMany({ author: authorId })
    .then((articles) => {
      if (!articles.length) {
        return res.status(404).json({
          success: false,
          message: `The author: ${authorId} has no articles`,
        });
      }
      res.status(200).json({
        success: true,
        message: `All the articles for the author: ${authorId}`,
        articles: articles,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

// This function returns article by its id
const getArticleById = (req, res) => {
  let id = req.params.id;
  articlesModel
    .findById(id)
    .populate("author", "firstName -_id")
    .exec()
    .then((article) => {
      if (article) {
        res.status(200).json({
          success: true,
          message: `The article ${id} `,
          article: article,
        });
      } else {
        throw new Error("Error happened while getting article");
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

// This function creates new article
const createNewArticle = (req, res) => {
  const { title, description } = req.body;
  const author = req.token.userId;
  const newArticle = new articlesModel({
    title,
    description,
    author,
  });

  newArticle
    .save()
    .then((article) => {
      res.status(201).json({
        success: true,
        message: `Article created`,
        article: article,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

// This function updates article by its id
const updateArticleById = (req, res) => {
  const id = req.params.id;
  const filter = req.body;
  Object.keys(filter).forEach((key) => {
    filter[key] == "" && delete filter[key];
  });
  articlesModel
    .findByIdAndUpdate({ _id: id }, req.body, { new: true })
    .then((newArticle) => {
      if (newArticle) {
        res.status(202).json({
          success: true,
          message: `Article updated`,
          article: newArticle,
        });
      } else {
        throw new Error("Error happened while deleting article");
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

// This function deletes a specific article by its id
const deleteArticleById = (req, res) => {
  const id = req.params.id;
  articlesModel
    .findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        res.status(200).json({
          success: true,
          message: `Article deleted`,
        });
      } else {
        throw new Error("Error happened while deleting article");
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

// This function deletes all the articles for a specific author
const deleteArticlesByAuthor = (req, res) => {
  // const author = req.body.author; //old solution should deleted
  const author = req.params.id;
  articlesModel
    .deleteMany({ author })
    .then((result) => {
      if (!result.deletedCount) {
        return res.status(404).json({
          success: false,
          message: `The Author not found`,
        });
      }
      res.status(200).json({
        success: true,
        message: `Deleted articles for the author: ${author}`,
        result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

module.exports = {
  getAllArticles,
  getArticlesByAuthor,
  getArticleById,
  createNewArticle,
  updateArticleById,
  deleteArticleById,
  deleteArticlesByAuthor,
};
