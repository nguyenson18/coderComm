import { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";

export const OnlineContext = createContext();

export const OnlineContextProvider = ({children}) => {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user , socket } = useAuth();

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [user]);
    return <OnlineContext.Provider value={{onlineUsers, setOnlineUsers}}>
        {children}
    </OnlineContext.Provider>
}   