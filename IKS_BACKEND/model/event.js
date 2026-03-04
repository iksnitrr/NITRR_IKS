import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  speaker: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    default: ""
  },
  venue: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["upcoming", "completed"],
    default: "upcoming"
  },
  images: {
    type: [{ url: String, name: String }], 
    default: []
  },
  noticePdfs: {
    type: [{ url: String, name: String }], 
    default: []
  }
}, { timestamps: true });

const event = mongoose.model("event", eventSchema);

export default event;