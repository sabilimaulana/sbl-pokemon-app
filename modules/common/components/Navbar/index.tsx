import { User } from "@common/types/user";
import { useAuth } from "context/AuthContext";
import { NextComponentType } from "next";
import Router from "next/router";
import Login from "../Login";
import Register from "../Register";

const Navbar: NextComponentType = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-row w-full h-56 px-12 border-b-2 justify-between">
      <div className="flex flex-col justify-center flex-1">
        <h1
          className="text-4xl w-60 cursor-pointer"
          onClick={() => Router.push("/")}
        >
          Pokemon App
        </h1>
      </div>

      {user.username === "" ? (
        <div className="flex flex-row py-2 h-full">
          <Register />
          <Login />
        </div>
      ) : (
        <div className="flex flex-row py-2 h-full">
          <p>{`Hello, ${user.username}`}</p>
        </div>
      )}
    </div>
  );
};

export default Navbar;
