const express = require("express");

exports.logoutHandle = (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/");
    });
}
exports.logoutRender = (req, res) => {
    res.render("home");
}