const dbConfig = require("./config/dbConfig.js");
const mongoose = require("mongoose");
const chatSchema = require("./models/chat.model");
const io = require("socket.io")(3000);

mongoose.Promise = global.Promise;

mongoose
  .connect(dbConfig.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((error) => {
    console.log("Could not connect to the database. Exiting now...", error);
    process.exit(1);
  });

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });
  socket.on("send-chat-message", async (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });

    console.log("message::", message);

    const data = new chatSchema({
      name: users[socket.id],
      message: message,
    });

    await data.save();
    console.log("message saved in database successfully!");
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});

// app.listen(3000, () => {
//   console.log("server has started...");
// });
