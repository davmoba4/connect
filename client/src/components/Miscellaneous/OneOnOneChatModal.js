import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";

const OneOnOneChatModal = ({ children }) => {
  const { user, chats, setChats } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState("");

  const toast = useToast();

  const createChatByEnter = (event) => {
    if (event.key === "Enter") {
      createChat();
    }
  };
  const createChat = async () => {
    if (!username) {
      toast({
        title: "Please enter a username to chat with",
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
      const userData = await axios.get(`/api/user?search=${username}`, config);

      const { data } = await axios.post(
        "/api/chat/create-one-on-one",
        { userId: userData.data._id },
        config
      );
      setChats([data, ...chats]);
      onClose();
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

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="25px" d="flex" justifyContent="center">
            Create a One on One Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl
              id="username-one-on-one-chat"
              isRequired
              onKeyDown={createChatByEnter}
            >
              <Input
                value={username}
                placeholder="Username of user you want to chat with"
                mt="3"
                mb="3"
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={createChat} colorScheme="blue">Create Chat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OneOnOneChatModal;
