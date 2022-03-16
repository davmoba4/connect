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
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserBadge from "./UserBadge";

const UpdateGroupChatModal = ({  }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState("");
  const [username, setUsername] = useState("");

  const toast = useToast();


  return (
    <>
      <IconButton  icon={<ViewIcon />} onClick={onOpen} />

      {/* <Modal onClose={onClose} isOpen={isOpen} isCentered>
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
            <FormControl id="username-group-chat" d="flex" alignItems="center" onKeyDown={addUserByEnter}>
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
            <Button onClick={createGroupChat} colorScheme="blue">Create Chat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </>
  );
};

export default UpdateGroupChatModal;
