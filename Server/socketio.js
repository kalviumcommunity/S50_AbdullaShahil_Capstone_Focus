const { Server } = require('socket.io');
const Message = require('./Models/messageModel');

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("joinCommunity", async (communityId) => {
      try {
        socket.join(communityId);
        console.log("joined community", communityId);
        const communityMessages = await Message.findOne({ communityId });
        socket.emit("message", communityMessages ? communityMessages.messages : []);
      } catch (error) {
        console.error("Error joining community:", error);
      }
    });

    socket.on('joinRoom', (room) => {
      socket.join(room); 
      console.log(`User ${socket.id} joined room ${room}`);
    });
  

    socket.on("message", async (message) => {
      try {
        console.log("Message received:", message);

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
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

module.exports = setupSocket;