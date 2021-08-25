import { User } from "@common/types/user";
import { createContext, useContext, ReactNode, useState } from "react";

type authContextType = {
  user: User;
  isLogin: boolean;
  login: (user: User) => void;
  logout: () => void;
};

const authContextDefaultValues: authContextType = {
  user: {
    _id: "",
    username: "",
    email: "",
    createdAt: "",
    updatedAt: "",
    __v: 0,
  },
  isLogin: false,
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
  return useContext(AuthContext);
}

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User>({
    _id: "",
    username: "",
    email: "",
    createdAt: "",
    updatedAt: "",
    __v: 0,
  });
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const login = (user: User) => {
    setUser(user);
    setIsLogin(true);
  };

  const logout = () => {
    setUser({
      _id: "",
      username: "",
      email: "",
      createdAt: "",
      updatedAt: "",
      __v: 0,
    });
    setIsLogin(false);
  };

  const value = {
    user,
    login,
    logout,
    isLogin,
  };

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
}
