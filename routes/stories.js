/** @format */

const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const { ensureAuth } = require("../middleware/auth");

router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("errors/500");
  }
});
module.exports = router;
