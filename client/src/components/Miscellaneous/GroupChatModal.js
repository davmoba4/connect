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
  const { user } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [username, setUsername] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toast = useToast();

  const contains = (list, user) => {
    return list.some((elem) => {
      return JSON.stringify(user) === JSON.stringify(elem);
    });
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
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.response.data.message,
        status: "error",
        position: "top",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  const deleteUser = async (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToDelete._id)
    );
  };

  const createGroupChat = async () => {};

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
                placeholder="Create a chat name"
                mt="3"
                mb="3"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl d="flex" alignItems="center">
              <Input
                placeholder="Add usernames of others one by one"
                mb="3"
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button ml="2" mb="3" onClick={addUser}>
                Add User
              </Button>
            </FormControl>
            <Flex flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadge
                  key={u._id}
                  user={u}
                  handleFunction={() => deleteUser(u)}
                />
              ))}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={createGroupChat}>Create Chat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
