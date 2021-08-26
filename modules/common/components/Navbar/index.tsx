import { User } from "@common/types/user";
import { useAuth } from "context/AuthContext";
import Cookies from "js-cookie";
import { NextComponentType } from "next";
import Router from "next/router";
import Login from "../Login";
import Register from "../Register";

const Navbar: NextComponentType = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      Cookies.remove("token");
      sessionStorage.removeItem("token");
      logout();

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-row w-full h-56 px-12 border-b-2 justify-between">
      <div className="flex flex-col justify-center flex-1">
        <h1
          className="text-4xl w-60 font-bold cursor-pointer"
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
        <div className="flex flex-col py-2 h-full justify-between text-xl">
          <p>{`Hello, ${user.username}`}</p>

          <button
            onClick={() => Router.push("/my-pokemon")}
            className="rounded bg-white border-2 border-blue-600 hover:bg-blue-600 hover:text-white py-2 px-4 text-blue-600"
          >
            My Pokemon List
          </button>
          <button
            onClick={() => Router.push("/exchange-center")}
            className="rounded bg-white border-2 border-blue-600 hover:bg-blue-600 hover:text-white py-2 px-4 text-blue-600"
          >
            Exchange Center
          </button>

          <button
            onClick={handleLogout}
            className="rounded bg-red-500 hover:bg-red-700 py-2 px-4 text-white"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
