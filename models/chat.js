import { Schema, model, models } from "mongoose";

const moment = require("moment-timezone");
const dateThailand = moment.tz(Date.now(), "Asia/Taipei");

const ChatSchema = new Schema({
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: {
    type: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    default: [],
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: "",
  },
  groupPhoto: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: dateThailand,
  },
  lastMessageAt: {
    type: Date,
    default: dateThailand,
  },
});

const Chat = models.Chat || model("Chat", ChatSchema);

export default Chat;
