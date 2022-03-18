import {
  Button,
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserBadge from "./UserBadge";

const GroupChatModal = ({ children }) => {
  const { user, chats, setChats } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState("");
  const [username, setUsername] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toast = useToast();

  const contains = (list, user) => {
    return list.some((elem) => {
      return JSON.stringify(user) === JSON.stringify(elem);
    });
  };

  const addUserByEnter = (event) => {
    if (event.key === "Enter") {
      addUser();
    }
  };
  const addUser = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${username}`, config);

      if (contains(selectedUsers, data)) {
        toast({
          title: "User already added",
          status: "warning",
          position: "top",
          duration: 10000,
          isClosable: true,
        });
        return;
      }

      setSelectedUsers([...selectedUsers, data]);
      setUsername("");
    } catch (error) {
      toast({
        title: "Error occurred!",
        description: error.response.data.message,
        status: "error",
        position: "top",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  const deleteUser = async (userToDelete) => {
    if (userToDelete._id.toString() === user._id.toString()) {
      toast({
        title: "You cannot remove the group admin",
        status: "warning",
        position: "top",
        duration: 10000,
        isClosable: true,
      });
    }
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToDelete._id)
    );
  };

  const createGroupChat = async () => {
    if (!groupChatName) {
      toast({
        title: "Please enter a name for your group chat",
        status: "warning",
        position: "top",
        duration: 10000,
        isClosable: true,
      });
      return;
    }
    if (selectedUsers?.length === 0) {
      toast({
        title: "Please add users to the group chat",
        status: "warning",
        position: "top",
        duration: 10000,
        isClosable: true,
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/create-group",
        {
          chatName: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New group chat created!",
        status: "success",
        position: "top",
        duration: 10000,
        isClosable: true,
      });
    } catch (error) {
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

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="25px" d="flex" justifyContent="center">
            Create a Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl id="name-group-chat" isRequired>
              <Input
                value={groupChatName}
                placeholder="Create a group name"
                mt="3"
                mb="3"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl
              id="username-group-chat"
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
              <Button ml="2" mb="3" onClick={addUser}>
                Add User
              </Button>
            </FormControl>
            <Flex flexWrap="wrap">
              <UserBadge
                key={user._id}
                badgeUser={user}
                adminId={user._id}
                handleClickFunction={null}
                handleCloseFunction={() => deleteUser(user)}
              />
              {selectedUsers.map((u) => (
                <UserBadge
                  key={u._id}
                  badgeUser={u}
                  adminId={user._id}
                  handleClickFunction={null}
                  handleCloseFunction={() => deleteUser(u)}
                />
              ))}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={createGroupChat} colorScheme="blue">
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
