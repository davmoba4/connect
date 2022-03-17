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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserBadge from "./UserBadge";

const UpdateGroupChatModal = ({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat } = ChatState();

  const [groupChatName, setGroupChatName] = useState("");
  const [username, setUsername] = useState("");
  const [newGroupAdmin, setNewGroupAdmin] = useState("");

  const toast = useToast();

  const chatOneOnOne = async (userToChatWith) => {}

  const removeUser = async () => { };
  
  const renameGroupByEnter = (event) => {
    if (event.key === "Enter") {
      renameGroup();
    }
  };
  const renameGroup = async () => { };

  const addUserByEnter = (event) => {
    if (event.key === "Enter") {
      addUser();
    }
  };
  const addUser = async () => { }
  
  const changeGroupAdmin = async () => {}

  return (
    <>
      <IconButton icon={<ViewIcon />} onClick={onOpen} />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="25px" d="flex" justifyContent="center">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Flex flexWrap="wrap">
              {selectedChat.users.map((u) => (
                <UserBadge
                  key={u._id}
                  badgeUser={u}
                  adminId={selectedChat.groupAdmin._id}
                  handleClickFunction={() => chatOneOnOne(u)}
                  handleFunction={() => removeUser(u)}
                />
              ))}
            </Flex>
            <FormControl id="name-update-group-chat" d="flex" alignItems="center" onKeyDown={renameGroupByEnter}>
              <Input
                value={groupChatName}
                placeholder="Change the group name"
                mt="3"
                mb="3"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button mt="3" ml="2" mb="3" onClick={renameGroup} colorScheme="teal">
                Update
              </Button>
            </FormControl>
            {selectedChat.groupAdmin._id === user._id ?
            (<><FormControl id="username-update-group-chat" d="flex" alignItems="center" onKeyDown={addUserByEnter}>
              <Input
                placeholder="Add usernames of others one by one"
                mb="3"
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button ml="2" mb="3" onClick={addUser} colorScheme="teal">
                Add User
              </Button>
              </FormControl>
            <FormControl id="new-group-admin-username" d="flex" alignItems="center">
              <Input
                placeholder="Enter username of new group admin"
                onChange={(e) => setNewGroupAdmin(e.target.value)}
              />
              <Button ml="2" onClick={changeGroupAdmin} colorScheme="red">
                Update
              </Button>
              </FormControl>
              </>) : null}
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
