const Chat = require('../model/chat');
const User = require('../model/user');

const resolvers = {
  Query: {
    chats: async (_, { senderId, recipientId }) => {
      console.log('Query chats:', { senderId, recipientId });
      return await Chat.find({
        $or: [
          { sender: senderId, recipient: recipientId },
          { sender: recipientId, recipient: senderId },
        ],
      }).populate('sender recipient');
    },
  },
  Mutation: {
   sendMessage: async (_, { recipientId, content, senderId }, { user, pubsub }) => {
  if (!user) throw new Error('Not authenticated');
  const actualSenderId = senderId || user.userId; // Fallback to context userId
  console.log('Mutation sendMessage:', { senderId: actualSenderId, recipientId, content, user });
  const message = new Chat({
    content,
    sender: actualSenderId,
    recipient: recipientId,
    createdAt: new Date().toISOString(),
  });
  await message.save();
  await message.populate('sender recipient');

  console.log('Publishing MESSAGE_RECEIVED:', message);
  pubsub.publish('MESSAGE_RECEIVED', { messageReceived: message });

  return message;
},
  },
  Subscription: {
    messageReceived: {
      subscribe: (_, { senderId, recipientId }, { pubsub }) => {
        console.log('Subscription messageReceived called with:', { senderId, recipientId });
        console.log('PubSub instance:', pubsub);
        if (typeof pubsub.asyncIterator !== 'function') {
          console.error('pubsub.asyncIterator is not a function!');
          throw new Error('PubSub misconfiguration');
        }
        const iterator = pubsub.asyncIterator('MESSAGE_RECEIVED');
        console.log('Iterator created:', iterator);
        return iterator;
      },
      resolve: (payload) => {
        console.log('Resolving subscription payload:', payload);
        return payload.messageReceived;
      },
    },
  },
  ChatMessage: {
    sender: (parent) => parent.sender,
    recipient: (parent) => parent.recipient,
  },
};

module.exports = resolvers;