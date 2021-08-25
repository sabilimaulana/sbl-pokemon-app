import axios from "axios";
import { NextComponentType } from "next";
import { useState } from "react";
import Cookies from "js-cookie";

const Register: NextComponentType = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [warning, setWarning] = useState("");

  const handleRegister = async () => {
    try {
      if (!email || !username || !password) {
        setWarning(`Please fill all fields.`);
        return;
      }

      const data = {
        email,
        username,
        password,
      };

      const res = await axios.post(
        "http://localhost:3000/api/v1/user/register",
        data
      );

      if (res.status === 200) {
        Cookies.set("token", res.data.token);
        sessionStorage.setItem("token", res.data?.token);

        setEmail("");
        setUsername("");
        setPassword("");
        setWarning("");
        window.location.reload();
      }
    } catch (error) {
      setWarning(`${error.response?.data?.message}`);
      console.log(error.response.data.message);
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col px-8">
      <h1>Register</h1>
      <div className="flex flex-col flex-1 justify-between">
        <input
          className="px-1 border-2 border-gray-400 rounded"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="px-1 border-2 border-gray-400 rounded"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="px-1 border-2 border-gray-400 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleRegister}
          className="px-1 border-2 border-gray-400 rounded hover:bg-gray-200"
        >
          Register
        </button>
      </div>
      <div className="h-8">
        <p className=" w-64 text-sm overflow-ellipsis">{warning}</p>
      </div>
    </div>
  );
};

export default Register;
