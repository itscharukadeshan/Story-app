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
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories/index", { stories });
  } catch (err) {
    console.error(err);
    res.render("errors/500");
  }
});
module.exports = router;
