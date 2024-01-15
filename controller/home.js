const express = require("express");

exports.home = (req, res) => {
        res.render("home", { user: req.session.user });
}