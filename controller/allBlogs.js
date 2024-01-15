const express = require("express");
const User = require("../model/user");
const Blog = require("../model/blog");

exports.BlogsHandle = async (req, res) => {
  const { title, content } = req.body;
  var isPost = false;
  const user = await User.findById(req.session.user._id);
  if (user.isAdmin == true) {
    isPost = true;
  }
  const newBlog = new Blog({ title, content, isPost, user: req.session.user._id });
  await newBlog.save();
  user.blog.push(newBlog._id);
  await user.save();
  res.redirect("/dashboard");
}

exports.BlogsRender = async (req, res) => {
  const blogs = await Blog.find({ isPost: true }).populate("user");

  res.render("allblogs", {
    user: req.session.user,
    blogs: blogs.map(blog => ({
      title: blog.title,
      content: blog.content,
      username: blog.user.username,
    })),
  });
}