import React from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import Navbar from "../Chats/Navbar";
import MyChats from "../Chats/MyChats";
import ChatBox from "../Chats/ChatBox";

function ChatPage() {
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <Navbar />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
}

export default ChatPage;
