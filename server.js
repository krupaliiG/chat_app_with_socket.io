const dbConfig = require("./config/dbConfig.js");
const mongoose = require("mongoose");
const chatSchema = require("./models/chat.model");
const io = require("socket.io")(3000);
const ObjectID = require("mongoose");

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
    chatSchema.find({ name }).then((results) => {
      for (let result of results) {
        const dateFunc = (timeStamp) => {
          const date = timeStamp.getDate();
          const month = timeStamp.getMonth();
          const year = timeStamp.getFullYear();
          return `${date}-${month}-${year}`;
        };

        let timestamp = dateFunc(result._id.getTimestamp());
        let todayDate = dateFunc(new Date());
        let message;

        const hour = result._id.getTimestamp().getHours();
        const minute = result._id.getTimestamp().getMinutes();

        if (timestamp == todayDate) {
          message = `${result.message}   ${hour}:${minute}`;
        } else {
          message = `${result.message}   ${timestamp} ${hour}:${minute}`;
        }
        socket.emit("list-messages", message);
      }
    });
    // socket.broadcast.emit("user-connected", name);
  });
  socket.on("send-chat-message", async (message, t) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
      t,
    });

    const data = new chatSchema({
      name: users[socket.id],
      message: message,
    });

    await data.save();
    console.log("message saved in database successfully!");
  });
  // socket.on("disconnect", () => {
  //   socket.broadcast.emit("user-disconnected", users[socket.id]);
  //   delete users[socket.id];
  // });
});
