import { Stack } from "@mui/material";
import React from "react";
import "../Message.css";
import InputEmoji from "react-input-emoji";
import { useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import useChat from "../../../hooks/useChat";
import { useFetchRecipientUser } from "../../../utils/FetchRecipientUser";
import { useState } from "react";
import moment from "moment";


function ChatBox() {
  const { user } = useAuth();
  const {createSendMessage, getMessage, messages, chats , newMessage} = useChat()
  const { recipientUser } = useFetchRecipientUser(chats, user);
  const [textMessage, setTextMessage] = useState("");

  const hanleSendMessage = () => {
    createSendMessage({
      receiverId: recipientUser?._id,
      chatId: chats?._id,
      text: textMessage,
    })
    setTextMessage("");
  };

  useEffect(() => {
    chats && getMessage({chatId: chats?._id});
  }, [chats]);
  if (!recipientUser)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        No conversation selected yet...
      </p>
    );
  return (
    <Stack
      gap={4}
      className="chat_box"
      style={{
        width: "60%",
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        alignSelf: "stretch",
      }}
    >
      <div className="chat_header">
        <strong>giang</strong>
      </div>
      <Stack
        gap={3}
        className="messages"
        style={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          alignSelf: "stretch",
        }}
      >
        {messages && messages?.map((item) => (
          <div className={ item?.receiverId !== user._id ? "message self" : "message"} key={item._id} style={{alignSelf: item?.receiverId !== user._id ? "end" : "start"}}>
          <span style={{ color: item?.receiverId !== user._id ? "black" : "white", marginRight:'10px'}}>{item?.text}</span>
          <span className="message-footer">{moment(item.createdAt).calendar()}</span>
        </div>
        ))}
      </Stack>
      <Stack
        gap={3}
        className="chat_input"
        style={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "row",
          alignSelf: "stretch",
          flexGrow: "0",
        }}
      >
        <InputEmoji
          value={textMessage}
          onChange={(e) => setTextMessage(e)}
          fontFamily="nunito"
          borderColor="rgba(71, 112,223, 0.2)"
        />
        <button className="send_btn" onClick={() => hanleSendMessage()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-send"
            viewBox="0 0 16 16"
          >
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
          </svg>
        </button>
      </Stack>
    </Stack>
  );
}

export default ChatBox;
