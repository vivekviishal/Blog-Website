const express = require("express");
const User = require("../model/user");
require("dotenv").config();

exports.registerHandle = async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        res.render("login", { registrationMessage: 'User already registered' });
    }

    const crypto = require('crypto');

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const newUser = new User({ username, email, password, verificationToken });
    await newUser.save();

    sendVerificationEmail(email, verificationToken);
    res.render("login", { registrationMessage: 'User registered. Please check your email for verification.' });
}

exports.registerRender = (req, res) => {
    res.render("register");
}

const nodemailer = require('nodemailer');

async function sendVerificationEmail(email, token) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD,
        },
        authMethod: "PLAIN",
    });

    const mailOptions = {
        from: 'vivekjsrvishal@gmail.com',
        to: email,
        subject: 'Email Verification',
        html: `
            <p>Thank you for registering with Ublogs. Please click the following link to verify your email:</p>
            <a href="http://localhost:3434/verify/${token}">Verify Email</a>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
}
