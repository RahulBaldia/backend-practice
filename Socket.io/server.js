import app from "./src/app.js";
import { createServer } from "http";
import { Server } from "socket.io";
const PORT = process.env.PORT || 3000;

const server = createServer(app);  
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    
    socket.on("message", (msg) => {
        console.log("a message", socket.id);
        console.log(msg)
        io.emit("abc",msg)
    });
});

server.listen(PORT, () => {
    console.log(`Server is Running on the Port ${PORT}`);
});
