const Chat = require('../model/chat');
const User = require('../model/user');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const ChatResolver = {
  Query: {
    chats: async (_, { senderId, recipientId }, { user }) => {
      try {
        if (!user) throw new Error('Authentication required');
        const chats = await Chat.find({
          $or: [
            { sender: senderId, recipient: recipientId },
            { sender: recipientId, recipient: senderId },
          ],
        })
          .populate('sender')
          .populate('recipient')
          .sort({ createdAt: 1 });
        return chats;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    sendMessage: async (_, { senderId, recipientId, content }) => {
      // sendMessage: async (_, {  recipientId, content }, { user }) => {
      try {
        // if (!user) throw new Error('Authentication required');
        const recipient = await User.findById(recipientId);
        if (!recipient) throw new Error(`User with id ${recipientId} not found`);
        const chat = await Chat.create({
          // sender: user.id,
          sender: senderId,
          recipient: recipientId,
          content,
        });
        const populatedChat = await Chat.findById(chat._id)
          .populate('sender')
          .populate('recipient');
        pubsub.publish('MESSAGE_RECEIVED', { messageReceived: populatedChat });
        return populatedChat;
      } catch (error) {
        throw error;
      }
    },
  },
  Subscription: {
    messageReceived: {
      subscribe: (_, { senderId, recipientId }) =>
        pubsub.asyncIterator(['MESSAGE_RECEIVED']),
    },
  },
};

module.exports = ChatResolver;