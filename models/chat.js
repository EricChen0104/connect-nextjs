import { Schema, model, models } from "mongoose";

const ChatSchema = new Schema({
  member: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = models.Chat || mongoose.model("Chat", ChatSchema);

export default Chat;
