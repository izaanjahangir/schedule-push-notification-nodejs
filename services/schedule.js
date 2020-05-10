const _ = require("lodash");

const scheduleLib = require("node-schedule");
const firebaseAdmin = require("./firebaseAdmin");
const User = require("../models/User");
const ScheduledNotification = require("../models/ScheduledNotification");
const schedule = {};

schedule.getJobs = function () {
  return scheduleLib.scheduledJobs;
};

schedule.createSchedule = async function (data) {
  try {
    const scheduledNotification = new ScheduledNotification({
      time: data.time,
      days: data.days,
      notification: {
        title: data.title,
        body: data.body,
      },
    });

    await scheduledNotification.save();

    const dayOfWeek = data.days.join(",");
    const timeToSent = data.time.split(":");
    const hours = timeToSent[0];
    const minutes = timeToSent[1];

    const scheduleId = scheduledNotification._id.toString();
    const scheduleTimeout = `${minutes} ${hours} * * ${dayOfWeek}`;

    scheduleLib.scheduleJob(scheduleId, scheduleTimeout, async () => {
      const users = await User.find({});

      const chunks = _.chunk(users, 500);

      const promises = chunks.map((u) => {
        const tokens = [];

        u.forEach((item) => {
          if (item.token) {
            tokens.push(item.token);
          }
        });

        const payload = {
          tokens,
          title: data.title,
          body: data.body,
        };

        return firebaseAdmin.sendMulticastNotification(payload);
      });

      await Promise.all(promises);
    });
  } catch (e) {
    throw e;
  }
};

schedule.reSchedule = async function () {
  try {
    const scheduledNotifications = await ScheduledNotification.find({});

    scheduledNotifications.forEach((scheduledNotification) => {
      const dayOfWeek = scheduledNotification.days.join(",");
      const timeToSent = scheduledNotification.time.split(":");
      const hours = timeToSent[0];
      const minutes = timeToSent[1];

      const scheduleId = scheduledNotification._id.toString();
      const scheduleTimeout = `${minutes} ${hours} * * ${dayOfWeek}`;

      scheduleLib.scheduleJob(scheduleId, scheduleTimeout, async () => {
        const users = await User.find({});

        const chunks = _.chunk(users, 500);

        const promises = chunks.map((u) => {
          const tokens = [];

          u.forEach((item) => {
            if (item.token) {
              tokens.push(item.token);
            }
          });

          const payload = {
            tokens,
            title: scheduledNotification.notification.title,
            body: scheduledNotification.notification.body,
          };

          return firebaseAdmin.sendMulticastNotification(payload);
        });

        await Promise.all(promises);
      });
    });
  } catch (e) {
    throw e;
  }
};

module.exports = schedule;
