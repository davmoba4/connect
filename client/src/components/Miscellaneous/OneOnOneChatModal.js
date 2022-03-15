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
} from "@chakra-ui/react";
import { useState } from "react";

const OneOnOneChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState();

  const createChatByEnter = (event) => {
    if (event.key === "Enter") {
      createChat();
    }
  };
  const createChat = async () => {};

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
            <Button onClick={createChat}>Create Chat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OneOnOneChatModal;
