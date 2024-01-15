const express = require('express');
// const router = express.Router();
const Blog = require('../model/blog');

// Handle GET request to render admin dashboard
exports.adminBlogs = async (req, res) => {
    try {
        // Query for blogs with isPost set to false
        const unpublishedBlogs = await Blog.find({ isPost: false }).populate('user');

        // Render the admin dashboard with the unpublished blogs
        res.render('adminDash', {
            user: req.session.user,
            blogs: unpublishedBlogs.map(blog => ({
                id: blog._id,
                title: blog.title,
                content: blog.content,
                email: blog.user.email,
            })),
        });
    } catch (error) {
        console.error('Error fetching unpublished blogs:', error);
        res.status(500).send('Internal Server Error');
    }
}

// module.exports = router;
