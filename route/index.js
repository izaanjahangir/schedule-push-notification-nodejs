const express = require("express");
const router = express.Router();

const ScheduledNotification = require("../models/ScheduledNotification");
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

router.get("/notification", async function (req, res) {
  try {
    const list = schedule.getJobs();
    const keys = Object.keys(list);

    let schedules = await ScheduledNotification.find({});

    schedules = schedules.filter((item) => keys.includes(item._id.toString()));

    res.json({
      data: { schedules },
      status: "success",
      message: "successfull",
    });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
});

module.exports = router;
