import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import GroupLogin from "./components/GroupLogin";
import ChatRoom from "./components/ChatRoom";
import "./App.css";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={GroupLogin} />
      <Route exact path="/group" component={ChatRoom} />
    </Switch>
  </BrowserRouter>
);
export default App;

// ************ working code for single chat **********
// import React, { useState, useEffect } from "react";
// import io from "socket.io-client";

// const socket = io("http://localhost:7000");

// const App = () => {
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);

//   useEffect(() => {
//     socket.on("message", (data) => {
//       setChat([...chat, data]);
//     });
//   });

//   const sendMessage = (event) => {
//     event.preventDefault();
//     socket.emit("message", { message });
//     setMessage("");
//   };

//   const onChangeMessage = (event) => {
//     setMessage(event.target.value);
//   };

//   return (
//     <div>
//       <h1>Chat App</h1>
//       <form onSubmit={sendMessage}>
//         <input
//           type="text"
//           name="message"
//           value={message}
//           onChange={onChangeMessage}
//         />
//         <button type="submit">Send</button>
//       </form>
//       {chat.map((eachChat, index) => {
///         return <h3 key={index}>{eachChat.message}</h3>;
//       })}
//     </div>
//   );
// };

// export default App;
