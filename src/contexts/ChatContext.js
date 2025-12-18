import { createContext, useState } from "react";
import apiService from "../app/apiService";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useOnline from "../hooks/onlineUser";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [messages, setMessages] = useState(null);
  const [chats, setChats] = useState(null);
  const [currentChat, setCurrentChat] = useState(null)
  const [newMessage, setNewMessage] = useState(null);
  const [notifications, setNotifications] = useState([])
  const { user, socket } = useAuth();
  const { onlineUsers } = useOnline()
  // send message
  useEffect(() => {
    if (socket === null) return;
    chats && newMessage &&
      socket.emit("sendMessage", {
        ...newMessage,
        senderId: user._id,
      });
  }, [chats, newMessage]);

  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", (res) => {
      if (chats?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });
    socket.on('getNotification', (res) => {
      const isChatOpen = onlineUsers?.some(item => item.userId === res?.toId)
      if (isChatOpen) {
        setNotifications(prev => [{ ...res, isRead: true }, ...prev])
      } else {
        setNotifications(prev => [res, ...prev])
      }
    })
    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, chats, currentChat]);

  useEffect(() => {
    const getUseChat = async () => {
      if (user?._id) {
        const response = await apiService.get(`/chat/${user._id}`)
        setCurrentChat(response.data)
      }
    }

    getUseChat()
  }, [user])

  const createChat = async ({ toUserId }) => {
    const response = await apiService.post("/chat/request", { toUserId });
    setChats(response.data);
  };

  const getMessage = async ({ chatId, fromId }) => {
    if (!chatId) return null
    const response = await apiService.get(`/message/${chatId}`);
    setMessages(response.data);
    const cusNoti = notifications?.map((item) => {
      if (item.fromId == fromId) {
        console.log(item.fromId, fromId)
        return { ...item, isRead: false }
      } else {
        return { ...item }
      }
    })
    setNotifications(cusNoti)
  };

  const createSendMessage = async ({ receiverId, chatId, text }) => {
    const response = await apiService.post("/message/send", {
      receiverId,
      chatId,
      text,
    });
    setNewMessage(response.data);
    setMessages((prev) => [...prev, response.data]);
  };

  return (
    <ChatContext.Provider
      value={{
        createSendMessage,
        createChat,
        getMessage,
        messages,
        chats,
        newMessage,
        notifications,
        setNotifications,
        currentChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
