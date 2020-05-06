const express = require("express");
const router = express.Router();

const schedule = require("../services/schedule");
const User = require("../models/User");

router.post("/user", async function (req, res) {
  try {
    const payload = {
      name: req.body.name,
      token: req.body.token,
    };

    const user = new User(payload);
    await user.save();

    res.json({
      data: { user },
      message: "User Created successfully",
      success: true,
    });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
});

router.post("/notification", async function (req, res) {
  try {
    const payload = {
      time: req.body.time,
      days: req.body.days,
      title: req.body.title,
      body: req.body.body,
    };

    await schedule.createSchedule(payload);

    res.json({
      data: {},
      message: "Success",
      success: true,
    });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
});

module.exports = router;
