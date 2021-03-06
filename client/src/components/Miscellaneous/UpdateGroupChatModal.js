import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserBadge from "./UserBadge";

/*
 *@description     The modal for updating a group chat
 */
const UpdateGroupChatModal = () => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } =
    ChatState();

  const [groupChatName, setGroupChatName] = useState("");
  const [username, setUsername] = useState("");
  const [newGroupAdmin, setNewGroupAdmin] = useState("");

  const toast = useToast();

  /*
   *@description     Handles the creation of a new one on one chat with
   *                 the user that was clicked. It uses the given
   *                 userToChatWith to sed a POST request to
   *                 /api/chat/create-one-on-one. It updates the
   *                 selectedChat state variable and calls to fetch
   *                 the chats again
   *@params          userToChatWith: the user for the new chat (User)
   */
  const chatOneOnOne = async (userToChatWith) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/create-one-on-one",
        { userId: userToChatWith._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      toast({
        title: "New one on one chat created!",
        status: "success",
        position: "top",
        duration: 10000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create the chat",
        description: error.response.data.message,
        status: "error",
        position: "top",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  /*
   *@description     Handles the removing of a user from the group. It uses
   *                 the state variable of selectedChat and the given
   *                 userToRemove to send a PUT request to
   *                 /api/chat/remove-from-group. It updates the selectedChat
   *                 state variable and calls to fetch the chats again.
   *@params          userToRemove: the user being removed (User)
   */
  const removeUser = async (userToRemove) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/remove-from-group",
        { chatId: selectedChat._id, userId: userToRemove._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to remove the user",
        description: error.response.data.message,
        status: "error",
        position: "top",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  /*
   *@description     Calls the function that handles the renaming of
   *                 the group by pressing enter
   */
  const renameGroupByEnter = (event) => {
    if (event.key === "Enter") {
      renameGroup();
    }
  };
  /*
   *@description     Handles the renaming of the group. It uses the state
   *                 variables of selectedChat and groupChatName to send a
   *                 PUT request to /api/chat/rename-group. It updates the
   *                 selectedChat state variable and calls to fetch the chats
   *                 again
   */
  const renameGroup = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/rename-group",
        { chatId: selectedChat._id, newChatName: groupChatName },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setGroupChatName("");
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to rename the chat",
        description: error.response.data.message,
        status: "error",
        position: "top",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  /*
   *@description     Calls the function to add users by pressing enter
   */
  const addUserByEnter = (event) => {
    if (event.key === "Enter") {
      addUser();
    }
  };
  /*
   *@description     Handles the adding of a new user to the chat. It uses
   *                 the state variable of username to send a GET request to
   *                 /api/user?search=<username> to get the ID and then uses
   *                 it along with the selectedChat state variable to send a
   *                 PUT request to /api/chat/add-to-group. It updates the
   *                 selectedChat state variable and calls to fetch the chats
   *                 again
   */
  const addUser = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const userData = await axios.get(`/api/user?search=${username}`, config);

      const { data } = await axios.put(
        "/api/chat/add-to-group",
        { chatId: selectedChat._id, userId: userData.data._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setUsername("");
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to add the user",
        description: error.response.data.message,
        status: "error",
        position: "top",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  /*
   *@description     Handles the changing of the group admin. It uses the
   *                 state variable of newGroupAdmin to send a get request
   *                 to /api/user?search=<new group admin> to get the ID then
   *                 uses it along with the selectedChat state variable to send
   *                 a PUT request to /api/chat/change-group-admin. It updates
   *                 the selectedChat state variable and calls to fetch the
   *                 chats again
   */
  const changeGroupAdmin = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const userData = await axios.get(
        `/api/user?search=${newGroupAdmin}`,
        config
      );

      const { data } = await axios.put(
        "/api/chat/change-group-admin",
        { chatId: selectedChat._id, newAdminId: userData.data._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setNewGroupAdmin("");
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to set the new admin",
        description: error.response.data.message,
        status: "error",
        position: "top",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <IconButton
        icon={<ViewIcon />}
        bg={colorMode === "dark" ? null : "#FBF8F1"}
        onClick={onOpen}
      />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="25px" d="flex" justifyContent="center">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Flex flexWrap="wrap" mb="1">
              {selectedChat.users.map((u) => (
                <UserBadge
                  key={u._id}
                  badgeUser={u}
                  adminId={selectedChat.groupAdmin._id}
                  handleClickFunction={() => chatOneOnOne(u)}
                  handleCloseFunction={() => removeUser(u)}
                />
              ))}
            </Flex>
            <Text
              fontSize="xs"
              mb={selectedChat.groupAdmin._id !== user._id && "2"}
            >
              * Click on a user to start a one on one chat
            </Text>
            <Text fontSize="xs" mb="2">
              {selectedChat.groupAdmin._id === user._id &&
                "* Click on the X to remove a user"}
            </Text>
            <FormControl
              id="name-update-group-chat"
              d="flex"
              alignItems="center"
              onKeyDown={renameGroupByEnter}
            >
              <Input
                value={groupChatName}
                placeholder="Change the group name"
                mt="3"
                mb="3"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                mt="3"
                ml="2"
                mb="3"
                onClick={renameGroup}
                colorScheme="teal"
              >
                Update
              </Button>
            </FormControl>
            {selectedChat.groupAdmin._id === user._id && (
              <>
                <FormControl
                  id="username-update-group-chat"
                  d="flex"
                  alignItems="center"
                  onKeyDown={addUserByEnter}
                >
                  <Input
                    value={username}
                    placeholder="Add usernames of others one by one"
                    mb="3"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Button ml="2" mb="3" onClick={addUser} colorScheme="teal">
                    Add User
                  </Button>
                </FormControl>
                <FormControl
                  id="new-group-admin-username"
                  d="flex"
                  alignItems="center"
                >
                  <Input
                    placeholder="Enter username of new group admin"
                    onChange={(e) => setNewGroupAdmin(e.target.value)}
                  />
                  <Button ml="2" onClick={changeGroupAdmin} colorScheme="red">
                    Update
                  </Button>
                </FormControl>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => removeUser(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
