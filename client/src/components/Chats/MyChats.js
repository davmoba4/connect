import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import GroupChatModal from "../Miscellaneous/GroupChatModal";
import OneOnOneChatModal from "../Miscellaneous/OneOnOneChatModal";
import ChatsLoading from "../Miscellaneous/ChatsLoading";
import { getSenderUsername } from "../../config/ChatLogic";

const MyChats = () => {
  const { colorMode } = useColorMode();
  const { user, chats, setChats, selectedChat, setSelectedChat, fetchAgain } =
    ChatState();
  const [loggedUser, setLoggedUser] = useState("");
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat/fetch-all", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error occurred!",
        description: "Failed to load the chats",
        status: "error",
        position: "bottom-left",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("connect-user-data")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      w={{ base: "100%", md: "31%" }}
      p="3"
      borderWidth="2px"
      borderRadius="10"
      bg={colorMode === "dark" ? "#072227" : "#E5E3C9"}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p="3"
        fontSize={{ base: "25px", md: "18px", lg: "27px" }}
      >
        My Chats
        <Menu>
          <MenuButton
            as={Button}
            d="flex"
            fontSize={{ base: "15px", md: "10px", lg: "17px" }}
            bg={colorMode === "dark" ? null : "#FBF8F1"}
            rightIcon={<AddIcon />}
          >
            New Chat
          </MenuButton>
          <MenuList fontSize={{ base: "15px", md: "10px", lg: "17px" }}>
            <OneOnOneChatModal>
              <MenuItem>One on One Chat</MenuItem>
            </OneOnOneChatModal>
            <MenuDivider />
            <GroupChatModal>
              <MenuItem>Group Chat</MenuItem>
            </GroupChatModal>
          </MenuList>
        </Menu>
      </Flex>
      <Flex
        flexDir="column"
        w="100%"
        h="100%"
        p="3"
        overflowY="hidden"
        borderRadius="10"
        bg={colorMode === "dark" ? "#203239" : "#EEEBDD"}
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                px="3"
                py="2"
                color={selectedChat._id === chat._id ? "white" : "black"}
                bg={selectedChat._id === chat._id ? "#38B2AC" : "#B4CFB0"}
                borderRadius="10"
              >
                <Text fontSize="lg">
                  {chat.isGroupChat
                    ? chat.chatName
                    : getSenderUsername(loggedUser, chat.users)}
                </Text>
                {chat.newestMessage && (
                  <Text fontSize="sm">
                    <strong>{chat.newestMessage.sender.username} : </strong>
                    {chat.newestMessage.content.length > 50
                      ? chat.newestMessage.content.substring(0, 51) + "..."
                      : chat.newestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatsLoading />
        )}
      </Flex>
    </Box>
  );
};

export default MyChats;
