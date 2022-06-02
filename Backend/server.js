const app = require("express")();
const server = require("http").createServer(app);
const dbConfig = require("./config/dbConfig.js");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const groupSchema = require("./models/group.model");
const userSchema = require("./models/user.model");
const chatSchema = require("./models/chat.model");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

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

app.get("/api/getgroupmessage", async (request, response) => {
  const { group } = request.query;
  const groupExists = await groupSchema.findOne({
    groupName: group,
  });
  if (!groupExists) {
    response.send("group doesn't exists");
  }
  const chats = await chatSchema.find({ groupId: groupExists._id });
  response.send(chats);
});

app.post("/api/login", async (request, response) => {
  const { userName, email, groupName } = request.body;
  const userExists = await userSchema.findOne({ email });

  if (!userExists) {
    let body = new userSchema({
      user: userName,
      email,
    });
    await body.save();
  }

  const groupExists = await groupSchema.findOne({
    groupName,
  });
  if (!groupExists) {
    let body = new groupSchema({
      groupName: groupName,
    });
    await body.save();
  }

  response.send({ user: userName, mail: email, group: groupName });
});

io.on("connection", (socket) => {
  socket.on("login-account", async (data) => {
    const groupDetail = await groupSchema.findOne({
      groupName: data.group,
    });

    const existingGroupMsg = await chatSchema.find({
      groupId: groupDetail._id,
    });

    if (existingGroupMsg.length) {
      io.emit("list-message", existingGroupMsg, data);
    } else {
      io.emit("no-messages", data);
    }
  });

  socket.on("send-message", async (payload) => {
    const groupDetail = await groupSchema.findOne({
      groupName: payload.group,
    });
    const userDetail = await userSchema.findOne({
      email: payload.user,
    });

    let body = new chatSchema({
      email: payload.user,
      message: payload.msg,
      groupId: groupDetail._id,
      userId: userDetail._id,
    });

    const data = await body.save();

    let groupName = groupDetail.groupName;

    io.emit("concat-message", payload.uid, data, groupName);
  });
});

server.listen(7000, () => {
  console.log("port connected at 7000");
});

// ****************** working single chat app code ***********************

// const app = require("express")();
// const server = require("http").createServer(app);
// const chatSchema = require("./models/chat.model");
// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//   },
// });

// io.on("connection", (socket) => {
//   console.log("connection made to socket!");
//   socket.on("message", (data) => {
//     console.log("data on server side:::", data);
//     io.emit("message", data);
//   });
// });

// server.listen(7000, () => {
//   console.log("Port connected at 7000");
// });

// *****************************************
