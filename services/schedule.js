const _ = require("lodash");

const scheduleLib = require("node-schedule");
const firebaseAdmin = require("./firebaseAdmin");
const User = require("../models/User");
const ScheduledNotification = require("../models/ScheduledNotification");
const schedule = {};

schedule.createSchedule = async function (data) {
  try {
    const scheduledNotification = new ScheduledNotification({
      time: data.time,
      days: data.days,
      notification: {
        title: data.title,
        body: data.bodyx,
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

module.exports = schedule;
