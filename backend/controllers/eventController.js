// const Event = require("../models/Event");
// const Registration = require("../models/Registration");

// exports.createEvent = async (req, res) => {
//   const event = await Event.create({
//     ...req.body,
//     organizer: req.user.id
//   });

//   res.json(event);
// };

// exports.getEvents = async (req, res) => {
//   const events = await Event.find({ status: "approved" });
//   res.json(events);
// };

// exports.registerEvent = async (req, res) => {
//   const reg = await Registration.create({
//     user: req.user.id,
//     event: req.params.id
//   });

//   res.json(reg);
// };