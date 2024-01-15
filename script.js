const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const User = require("./model/user");
var session = require("express-session");
app.use(express.json());
const Blog = require("./model/blog");
app.use(
  session({
    secret: "secret",
  })
);
app.use(express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "hbs");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

function checkIsLoggedIn(req, res, next) {
  if (req.session.IsLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

const { home } = require("./controller/home");
const { loginRender, loginHandle } = require("./controller/login");
const { registerRender, registerHandle } = require("./controller/register");
const { logoutHandle, logoutRender } = require("./controller/logout");
const { BlogsHandle, BlogsRender } = require("./controller/allBlogs");
const { approveHandle, rejectHandle } = require("./controller/approve");
const { adminBlogs } = require("./controller/adminBlogs");


app.get("/", home);

app.post("/login", loginHandle);
app.get("/login", loginRender);

app.post("/register", registerHandle);
app.get("/register", registerRender);

app.post("/logout", logoutHandle);
app.get("/logout", logoutRender);

app.post("/blogs", BlogsHandle);
app.get("/blogs", BlogsRender);

app.use("/approve/:blogId", approveHandle);
app.use("/reject/:blogId", rejectHandle);

app.get("/admin/blogs", adminBlogs);

app.get("/dashboard", checkIsLoggedIn, async (req, res) => {
  const user = await User.findById(req.session.user._id).populate("blog");
  res.render("dashboard", { user: req.session.user, blogs: user.blog });
});

app.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(404).json({ message: 'Invalid verification token.' });
  }

  if (user.verificationTokenExpires < Date.now()) {
    return res.status(400).json({ message: 'Verification token has expired.' });
  }
  user.isVerified = true;
  await user.save();
  console.log(user.isVerified);
  res.json({ message: 'Email verified successfully. You can now log in.' });
});


mongoose.connect(DATABASE_URL).then(() =>
  app.listen(PORT, () => {
    console.log("app started in port -> " + PORT);
  })
);