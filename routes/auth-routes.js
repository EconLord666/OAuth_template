const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user-model");

router.get("/login", (req, res) => {
  res.render("login.ejs", { user: req.user });
});

router.get("/signup", (req, res) => {
  res.render("signup", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

router.post("/signup", async (req, res) => {
  console.log(req.body);
  let { name, email, password } = req.body;
  // check if the data exists
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    req.flash("error_msg", "Email is registered by someone else");
    res.redirect("/auth/signup");
  }

  const hash = await bcrypt.hash(password, 10);
  password = hash;
  let newUser = new User({ name, email, password });
  try {
    const savedUser = await newUser.save();
    req.flash("success_msg", "Successfully registered. You can login now.");
    res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
    // req.flash("error_msg", err.errors.name.message);
    res.redirect("/auth/signup");
  }
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile");
});

module.exports = router;
