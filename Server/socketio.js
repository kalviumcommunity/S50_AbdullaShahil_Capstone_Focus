const { Server } = require('socket.io');
const Message = require('./Models/messageModel');
const PersonalMessage = require('./Models/personalMessageModel');

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    // Community Chat Handlers
    socket.on("joinCommunity", async (communityId) => {
      try {
        socket.join(communityId);
        console.log("Joined community", communityId);
        
        const communityMessages = await Message.findOne({ communityId });
        socket.emit("message", communityMessages.messages);
      } catch (error) {
        console.error("Error joining community:", error);
        socket.emit("error", "Failed to join community");
      }
    });
    
    socket.on("message", async (message) => {
      try {
        if (!message.name || !message.message || !message.communityId) {
          console.error("Invalid message structure:", message);
          return;
        }
        
        const result = await Message.updateOne(
          { communityId: message.communityId },
          { $push: { messages: message } },
          { upsert: true }
          );
          
          console.log("Database update result:", result);
          io.to(message.communityId).emit("message", message);
        } catch (error) {
          console.error("Error processing message:", error);
          socket.emit("error", "Failed to send message");
        }
      });
      
      // Personal Chat Handlers
      socket.on("joinPersonalChat", async ( {userId, otherUserId} ) => {
        try {
          const room = getPersonalRoomId(userId, otherUserId);
          socket.join(room);

        const personalMessages = await PersonalMessage.findOne({ room:room });
        console.log(personalMessages)
        socket.emit("personalMessage", personalMessages.messages);
      } catch (error) {
        console.error("Error joining personal chat:", error);
        socket.emit("error", "Failed to join personal chat");
      }
    });

    socket.on("personalMessage", async (message) => {
      try {
        const { senderId, receiverId } = message;
        const room = getPersonalRoomId(senderId, receiverId);
        console.log("room", room, senderId, receiverId)
        
        await PersonalMessage.updateOne(
          { room },
          { $push: { messages: message } },
          { upsert: true }
          );
          
        io.to(room).emit("personalMessage", message);
      } catch (error) {
        console.error("Error processing personal message:", error);
        socket.emit("error", "Failed to send personal message");
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

const getPersonalRoomId = (userId, otherUserId) => {
  return [userId, otherUserId].sort().join("_");
};

module.exports = setupSocket;
