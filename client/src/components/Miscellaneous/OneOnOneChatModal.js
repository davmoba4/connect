import { ViewIcon } from "@chakra-ui/icons";
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
            Create One on One Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl
              id="usernameToChatWith"
              isRequired
              onKeyDown={createChatByEnter}
            >
              <Input
                placeholder="Username of user to chat with"
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
