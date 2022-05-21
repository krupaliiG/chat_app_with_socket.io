const socket = io("http://localhost:3000");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");

const name = prompt("What is your name?");
appendMessage("You joined");
socket.emit("new-user", name);

socket.on("chat-message", (data) => {
  appendMessage(`${data.name}: ${data.message}   ${data.t}`);
});

socket.on("list-messages", (result) => {
  appendMessage(result);
});

// socket.on("user-connected", (name) => {
//   appendMessage(`${name} connected`);
// });

// socket.on("user-disconnected", (name) => {
//   appendMessage(`${name} disconnected`);
// });

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const d = new Date();
  const t = d.toTimeString().split(" ")[0];
  appendMessage(`You: ${message}     ${t}`);
  socket.emit("send-chat-message", message, t);
  messageInput.value = "";
});

function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
