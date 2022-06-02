import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "./index.css";
const io = require("socket.io-client");
const socket = io.connect("http://localhost:7000");

const GroupLogin = (props) => {
  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [groupName, setgroupName] = useState("school");

  const { history } = props;

  const loginInGroup = async (e) => {
    e.preventDefault();
    const id = uuidv4();

    sessionStorage.setItem("uuid", JSON.stringify(id));

    const options = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const response = await axios.post(
      "http://localhost:7000/api/login",
      {
        userName,
        email,
        groupName,
      },
      options
    );

    const { data } = response;
    const { user, mail, group } = data;

    socket.emit("login-account", { id, mail, user, group });
    history.replace("/group");
  };

  const changeName = (event) => {
    setuserName(event.target.value);
  };

  const changeEmail = (event) => {
    setEmail(event.target.value);
  };

  const changeGroup = (event) => {
    setgroupName(event.target.value);
  };

  const changeNewRoomName = (event) => {
    setgroupName(event.target.value);
  };

  return (
    <div>
      <form onSubmit={loginInGroup} className="form-control">
        <label>Your name please:</label>
        <input type="text" onChange={changeName} />
        <label>Your email please:</label>
        <input type="email" onChange={changeEmail} />
        <label>Select group:</label>
        <select onChange={changeGroup}>
          <option value="school">school</option>
          <option value="college">college</option>
          <option value="adda">adda</option>
        </select>
        <label>Enter New Room Name:</label>
        <input type="text" onChange={changeNewRoomName} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default GroupLogin;

// import { useState } from "react";
// import { v4 as uuidv4 } from "uuid";
// import "./index.css";
// const io = require("socket.io-client");
// const socket = io.connect("http://localhost:7000");

// const GroupLogin = (props) => {
//   const [userName, setuserName] = useState("");
//   const [email, setEmail] = useState("");
//   const [groupName, setgroupName] = useState("school");

//   const { history } = props;

//   const loginInGroup = (e) => {
//     e.preventDefault();
//     const id = uuidv4();

//     sessionStorage.setItem("uuid", JSON.stringify(id));
//     socket.emit("login-account", { id, email, userName, groupName });
//     history.replace("/group");
//   };

//   const changeName = (event) => {
//     setuserName(event.target.value);
//   };

//   const changeEmail = (event) => {
//     setEmail(event.target.value);
//   };

//   const changeGroup = (event) => {
//     setgroupName(event.target.value);
//   };

//   const changeNewRoomName = (event) => {
//     setgroupName(event.target.value);
//   };

//   return (
//     <div>
//       <form onSubmit={loginInGroup} className="form-control">
//         <label>Your name please:</label>
//         <input type="text" onChange={changeName} />
//         <label>Your email please:</label>
//         <input type="email" onChange={changeEmail} />
//         <label>Select group:</label>
//         <select onChange={changeGroup}>
//           <option value="school">school</option>
//           <option value="college">college</option>
//           <option value="adda">adda</option>
//         </select>
//         <label>Enter New Room Name:</label>
//         <input type="text" onChange={changeNewRoomName} />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default GroupLogin;
