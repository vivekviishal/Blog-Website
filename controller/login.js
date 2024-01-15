const express = require("express");
const User = require("../model/user");

exports.loginHandle = async (req, res) => {
    const { username, password } = req.body;
    let user = await User.findOne({ username: username });

    if (user) {
        if (user.password !== password) {
            res.render("login",{ registrationMessage: 'Wrong Password' });
        } else {
            req.session.IsLoggedIn = true;
            req.session.user = user;
            if (user.isAdmin == true) {
                res.redirect('/admin/blogs');
            } else {
                res.render("home", { user: req.session.user });
            }
        }
    } else {
        res.render("register");
    }
}
exports.loginRender = (req, res) => {
    res.render("login");
}