import React, { useContext, useEffect, useState } from "react";
import "./style.css";

import axios from "axios";

import { AuthContext } from "../../contexts/authContext";
//===============================================================

const Dashboard = () => {
  const { token } = useContext(AuthContext);

  const [articles, setArticles] = useState("");
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [updateBox, setUpdateBox] = useState(false);
  const [articleId, setArticleId] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [comment, setComment] = useState("");

  //===============================================================

  const getAllArticles = async () => {
    try {
      const res = await axios.get("https://blog-it-n9gi.onrender.com/articles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        console.log(res.data.articles);
        setArticles(res.data.articles);
        setMessage("");
        setShow(true);
        setUserId(res.data.userId);
      } else throw Error;
    } catch (error) {
      if (!error.response.data.success) {
        return setMessage(error.response.data.message);
      }
      setMessage("Error happened while Get Data, please try again");
    }
  };

  //===============================================================

  const handleUpdateClick = (article) => {
    setUpdateBox(!updateBox);
    setArticleId(article._id);
    setTitle(article.title);
    setDescription(article.description);
    if (updateBox) updateArticle(article._id);
  };

  //===============================================================

  const updateArticle = async (id) => {
    try {
      const res = await axios.put(`https://blog-it-n9gi.onrender.com/articles/${id}`, {
        title,
        description,
      });
      if (res.data.success) {
        console.log(res.data.article._id);
        const newArticles = articles.map((element, i) => {
          if (element._id === res.data.article._id) {
            element.title = res.data.article.title;
            element.description = res.data.article.description;
          }
          return element;
        });
        setArticles(newArticles);
      } else throw Error;
    } catch (error) {
      console.log(error);
    }
  };

  //===============================================================

  const deleteArticle = async (id) => {
    try {
      const res = await axios.delete(`https://blog-it-n9gi.onrender.com/articles/${id}`);
      if (res.data.success) {
        const newArticles = articles.filter((ele, i) => {
          return ele._id !== id;
        });
        setArticles(newArticles);
      } else throw Error;
    } catch (error) {
      console.log(error);
    }
  };

  //===============================================================

  const addComment = async (id) => {
    try {
      const res = await axios.post(
        `https://blog-it-n9gi.onrender.com/articles/${id}/comments`,
        {
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        const newArticles = articles.map((element, i) => {
          if (element._id === id) {
            element.comments.push(res.data.comment);
          }
          return element;
        });
        setArticles(newArticles);
      } else throw Error;
    } catch (error) {
      console.log(error);
    }
  };

  //===============================================================

  useEffect(() => {
    getAllArticles();
  }, []);

  //===============================================================

  return (
    <>
      <br />
      {show &&
        articles.map((article, index) => (
          <div key={index} className="article">
            <div><h4>{article.title}</h4></div>
            <div><p>{article.description}</p></div>
            <div>
              {article.comments ? (
                article.comments.map((comment, i) => {
                  return (
                    <p className="comment" key={i}>
                      {comment.comment}
                    </p>
                  );
                })
              ) : (
                <></>
              )}
            </div>
            {article.author === userId && (
              <>
                {updateBox && articleId === article._id && (
                  <form>
                    <br />
                    <input
                      type="text"
                      defaultValue={article.title}
                      placeholder="article title here"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <br />

                    <textarea
                      placeholder="article description here"
                      defaultValue={article.description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </form>
                )}
                <button
                  className="delete"
                  onClick={() => deleteArticle(article._id)}
                >
                  X
                </button>
                <button
                  className="update"
                  onClick={() => handleUpdateClick(article)}
                >
                  Update
                </button>
              </>
            )}
            <div>
              <textarea
                className="commentBox"
                placeholder="comment..."
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
              <button
                className="commentBtn"
                onClick={() => {
                  addComment(article._id);
                }}
              >
                Add comment
              </button>
            </div>
          </div>
        ))}
      {message && <div>{message}</div>}
    </>
  );
};

export default Dashboard;
