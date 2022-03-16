import { Box, useColorMode } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../context/ChatProvider";

const ChatBox = () => {
  const { colorMode } = useColorMode();
  const { selectedChat } = ChatState();
  
  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDir="column"
      alignItems="center"
      w={{ base: "100%", md: "68%" }}
      p="3"
      borderWidth="2px"
      borderRadius="10"
      bg={colorMode === "dark" ? "#072227" : "#E5E3C9"}
    ></Box>
  );
};

export default ChatBox;
