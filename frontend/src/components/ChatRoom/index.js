import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const io = require("socket.io-client");
const socket = io.connect("http://localhost:7000");

const ChatRoom = () => {
  const [isMsg, setisMsg] = useState(false);
  const [msg, setMsg] = useState("");
  const [chats, setChat] = useState([]);
  const [user, setUser] = useState("");
  const [group, setGroup] = useState("school");

  socket.on("no-messages", (data) => {
    const id = JSON.parse(sessionStorage.getItem("uuid"));
    if (id === data.id) {
      setUser(data.mail);
      setGroup(data.group);
      setisMsg(false);
    }
  });

  socket.on("list-message", (existingGroupMsg, data) => {
    const id = JSON.parse(sessionStorage.getItem("uuid"));

    if (id === data.id) {
      fetchgroupMsg(data);
      setUser(data.mail);
      setGroup(data.group);
    }
  });

  socket.on("concat-message", (uid, data, groupName) => {
    if (group === groupName) {
      setChat([...chats, data]);
      setisMsg(true);
      setMsg("");
    }
  });

  useEffect(() => {
    setisMsg(true);
  }, [chats, isMsg]);

  const fetchgroupMsg = async (data) => {
    const response = await axios.get(
      "http://localhost:7000/api/getgroupmessage",
      { params: { group: data.group } }
    );
    setChat(response.data);
  };

  const onSendMsg = (event) => {
    event.preventDefault();
    const uid = JSON.parse(sessionStorage.getItem("uuid"));
    socket.emit("send-message", { uid, msg, user, group });
    setMsg("");
  };

  const onChangeMsgValue = (event) => {
    setMsg(event.target.value);
  };

  const onExit = () => {
    sessionStorage.removeItem("uuid");
  };

  const extractDate = (timestamp) => {
    const date = timestamp.getDate();
    const month = timestamp.getMonth();
    const year = timestamp.getFullYear();
    return `${date}-${month}-${year}`;
  };

  const extractTime = (timestamp) => {
    const hour = timestamp.getHours();
    const minute = timestamp.getMinutes();
    return `${hour}:${minute}`;
  };

  return (
    <>
      {isMsg ? (
        chats.map((eachChat) => {
          const BY = eachChat.email === user ? "You" : eachChat.email;
          const todayDate = extractDate(new Date());
          const date = extractDate(new Date(eachChat.createdAt));

          const showDateTime =
            todayDate !== date
              ? date
              : extractTime(new Date(eachChat.createdAt));

          // const showDateTime = todayDate === date
          return (
            <li key={eachChat._id}>
              {eachChat.message}
              <span>
                <b>{BY}</b>
              </span>
              <span> {showDateTime}</span>
            </li>
          );
        })
      ) : (
        <li>No messages available to show!</li>
      )}
      <form onSubmit={onSendMsg}>
        <input
          type="text"
          placeholder="Type a message..."
          onChange={onChangeMsgValue}
        />
        <button type="submit">Send</button>
      </form>
      <Link to="/">
        <button type="button" onClick={onExit}>
          Exit
        </button>
      </Link>
    </>
  );
};

export default ChatRoom;

// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// const io = require("socket.io-client");
// const socket = io.connect("http://localhost:7000");

// const ChatRoom = () => {
//   const [isMsg, setisMsg] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [chats, setChat] = useState([]);
//   // const [user, setUser] = useState("");
//   // const [group, setGroup] = useState("school");

//   useEffect(() => {
//     socket.on("list-message", (existingGroupMsg, data) => {
//       const id = JSON.parse(sessionStorage.getItem("uuid"));

//       if (id === data.id) {
//         sessionStorage.setItem("currentUserEmail", JSON.stringify(data.email));
//         sessionStorage.setItem("group", data.groupName);
//         sessionStorage.setItem("chats", JSON.stringify(existingGroupMsg));
//         const chatData = JSON.parse(sessionStorage.getItem("chats"));
//         setChat([...chatData]);
//         setisMsg(true);
//       }
//     });
//     socket.on("no-messages", (data) => {
//       const id = JSON.parse(sessionStorage.getItem("uuid"));

//       if (id === data.id) {
//         sessionStorage.setItem("currentUserEmail", JSON.stringify(data.email));
//         sessionStorage.setItem("group", data.groupName);
//       }
//     });
//     socket.on("concat-message", (uid, data, groupName) => {
//       const group = sessionStorage.getItem("group");
//       if (group === groupName) {
//         setChat([...chats, data]);
//         setisMsg(true);
//         setMsg("");
//       }
//     });
//   });

//   const onSendMsg = (event) => {
//     event.preventDefault();
//     const email = JSON.parse(sessionStorage.getItem("currentUserEmail"));
//     const uid = JSON.parse(sessionStorage.getItem("uuid"));
//     const group = sessionStorage.getItem("group");
//     setMsg("");
//     socket.emit("send-message", { uid, email, msg, group });
//   };

//   const onChangeMsgValue = (event) => {
//     setMsg(event.target.value);
//   };

//   const onExit = () => {
//     sessionStorage.removeItem("chats");
//     sessionStorage.removeItem("currentUserEmail");
//     sessionStorage.removeItem("uuid");
//     sessionStorage.removeItem("group");
//   };

//   return (
//     <>
//       {isMsg ? (
//         chats.map((eachChat) => {
//           const BY =
//             eachChat.email ===
//             JSON.parse(sessionStorage.getItem("currentUserEmail"))
//               ? "You"
//               : eachChat.email;
//           return (
//             <li key={eachChat._id}>
//               {eachChat.message}
//               <span>
//                 <b>{BY}</b>
//               </span>
//             </li>
//           );
//         })
//       ) : (
//         <li>No messages available to show!</li>
//       )}
//       <form onSubmit={onSendMsg}>
//         <input
//           type="text"
//           placeholder="Type a message..."
//           onChange={onChangeMsgValue}
//         />
//         <button type="submit">Send</button>
//       </form>
//       <Link to="/">
//         <button type="button" onClick={onExit}>
//           Exit
//         </button>
//       </Link>
//     </>
//   );
// };

// export default ChatRoom;
