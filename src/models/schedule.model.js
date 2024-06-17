const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date },
    description: { type: String },
});

const Schedule = mongoose.model("Schedule", ScheduleSchema);
module.exports = Schedule;
