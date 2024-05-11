const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join-room", (data) => {
        console.log("Room",data);
       socket.join(data);
    });

    socket.on("message-socket", (data) => {
        console.log("Message From user:", data);
        socket.to(data.room).emit("receive-message", data);
    });


});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
