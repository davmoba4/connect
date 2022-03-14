import { AddIcon } from "@chakra-ui/icons";
import { Button, Flex, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useColorMode, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import GroupChatModal from "../Miscellaneous/GroupChatModal";
import OneOnOneChatModal from "../Miscellaneous/OneOnOneChatModal";

const MyChats = () => {
  const { colorMode } = useColorMode();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
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
        title: "Error occured!",
        description: "Failed to load the chats",
        status: "error",
        position: "bottom-left",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      d={{ base: selectedChat ? "none" : null }}
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
        fontSize={{base: "25px", md: "18px", lg: "27px"}}
      >My Chats
      <Menu>
          <MenuButton
            as={Button}
            d="flex"
            fontSize={{base: "15px", md: "10px", lg: "17px"}}
            rightIcon={<AddIcon />}
          >
            New Chat
          </MenuButton>
          <MenuList fontSize={{base: "15px", md: "10px", lg: "17px"}}>
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
    </Flex>
  );
};

export default MyChats;
