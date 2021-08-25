import axios from "axios";
import Cookies from "js-cookie";
import { NextComponentType } from "next";
import Router from "next/router";
import { useState } from "react";

const Login: NextComponentType = () => {
  const [warning, setWarning] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        setWarning("Please fill all fields.");
        return;
      }

      const data = { username, password };

      const res = await axios.post(
        "http://localhost:3000/api/v1/user/login",
        data
      );

      if (res.status === 200) {
        Cookies.set("token", res.data?.token);
        sessionStorage.setItem("token", res.data?.token);
        setWarning("");
        setUsername("");
        setPassword("");

        window.location.reload();
      }
    } catch (error) {
      setWarning(error?.response?.data?.message);
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col px-8">
      <h1>Login</h1>
      <div className="flex flex-col flex-1 justify-between">
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
          onClick={handleLogin}
          className="px-1 border-2 border-gray-400 rounded hover:bg-gray-200"
        >
          Login
        </button>
      </div>

      <div className="h-8">
        <p className=" w-64 text-sm overflow-ellipsis">{warning}</p>
      </div>
    </div>
  );
};

export default Login;
