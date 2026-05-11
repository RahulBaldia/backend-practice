import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'New Chat',
      trim: true,
    },
    // ref links to User._id — enables populate() and lets us filter chats by owner
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
