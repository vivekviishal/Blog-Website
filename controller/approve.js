const express = require('express');
// const router = express.Router();
const Blog = require('../model/blog');

// Handle POST request to approve a blog
exports.approveHandle = async (req, res) => {
    const blogId = req.params.blogId;

    try {
        // Check if blogId is provided
        if (!blogId) {
            return res.status(400).json({ error: 'Invalid blogId' });
        }

        // Update the blog's isPost property to true
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, { isPost: true }, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        return res.redirect('/admin/blogs');
    } catch (error) {
        console.error('Error approving blog:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
// Handle POST request to reject a blog
exports.rejectHandle = async (req, res) => {
    const blogId = req.params.blogId;

    try {
        // Find the blog by ID and update the isPost property to false (rejected)
        await Blog.findOneAndDelete({ _id: blogId });

        console.log('Blog rejected and deleted successfully.');
        return res.redirect('/admin/blogs'); // Redirect back to the admin dashboard after rejection
    } catch (err) {
        console.error('Error rejecting blog:', err);
        res.status(500).send('Internal Server Error');
    }
}

// module.exports = router;
