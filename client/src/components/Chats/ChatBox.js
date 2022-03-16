import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text, useColorMode } from "@chakra-ui/react";
import React from "react";
import { getSenderObject, getSenderUsername } from "../../config/ChatLogic";
import { ChatState } from "../../context/ChatProvider";
import UpdateGroupChatModal from "../Miscellaneous/UpdateGroupChatModal";
import ProfileModal from "../Miscellaneous/ProfileModal";

const ChatBox = () => {
  const { colorMode } = useColorMode();
  const { user, selectedChat, setSelectedChat } = ChatState();

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
    >
      {selectedChat ? (
        <>
          <Text
            d="flex"
            alignItems="center"
            justifyContent={{ base: "space-between" }}
            w="100%"
            pb="3"
            px="2"
            fontSize={{ base: "25px", md: "18px", lg: "27px" }}
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              bg={colorMode === "dark" ? null : "#FBF8F1"}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {selectedChat.isGroupChat ? (
              <>
                {selectedChat.chatName} <UpdateGroupChatModal />
              </>
            ) : (
              <>
                {getSenderUsername(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderObject(user, selectedChat.users)}
                />
              </>
            )}
          </Text>
          <Flex
            flexDir="column"
            justifyContent="flex-end"
            w="100%"
            h="100%"
            p="3"
            overflowY="hidden"
            borderRadius="10"
            bg={colorMode === "dark" ? "#203239" : "#EEEBDD"}
          >
            {/* Messages */}
          </Flex>
        </>
      ) : (
        <Flex alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl">Click on a user or group to start chatting</Text>
        </Flex>
      )}
    </Box>
  );
};

export default ChatBox;
