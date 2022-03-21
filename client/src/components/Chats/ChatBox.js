import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FormControl,
  IconButton,
  Input,
  InputRightElement,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getSenderObject, getSenderUsername } from "../../config/ChatLogic";
import { ChatState } from "../../context/ChatProvider";
import UpdateGroupChatModal from "../Miscellaneous/UpdateGroupChatModal";
import ProfileModal from "../Miscellaneous/ProfileModal";
import Messages from "./Messages";
import axios from "axios";
import EmojiModal from "../Miscellaneous/EmojiModal";

const ChatBox = () => {
  const { colorMode } = useColorMode();
  const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } =
    ChatState();

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      if (data) {
        setMessages(data);
      }
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occurred!",
        description: "Failed to load the messages",
        status: "error",
        position: "top",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        setNewMessage("");
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/message",
          {
            chatId: selectedChat._id,
            content: newMessage,
          },
          config
        );
        setMessages([...messages, data]);
        setFetchAgain(!fetchAgain);
      } catch (error) {
        toast({
          title: "Error occurred!",
          description: "Failed to send the message",
          status: "error",
          position: "top",
          duration: 10000,
          isClosable: true,
        });
      }
    }
  };

  const handleTyping = (event) => {
    setNewMessage(event.target.value);
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDir="column"
      alignItems="center"
      w={{ base: "100%", md: "68%" }}
      p="3"
      borderWidth="2px"
      borderRadius="10"
      bg={colorMode === "dark" ? "#072227" : "#E5E3C9"}
    >
      {selectedChat ? (
        <>
          <Text
            d="flex"
            alignItems="center"
            justifyContent={{ base: "space-between" }}
            w="100%"
            pb="3"
            px="2"
            fontSize={{ base: "25px", md: "18px", lg: "27px" }}
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              bg={colorMode === "dark" ? null : "#FBF8F1"}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {selectedChat.isGroupChat ? (
              <>
                {selectedChat.chatName} <UpdateGroupChatModal />
              </>
            ) : (
              <>
                {getSenderUsername(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderObject(user, selectedChat.users)}
                />
              </>
            )}
          </Text>
          <Flex
            flexDir="column"
            justifyContent="flex-end"
            w="100%"
            h="100%"
            p="3"
            overflowY="hidden"
            borderRadius="10"
            bg={colorMode === "dark" ? "#203239" : "#EEEBDD"}
          >
            {loading ? (
              <Spinner size="xl" w="20" h="20" alignSelf="center" m="auto" />
            ) : (
              <Flex
                flexDir="column"
                overflowY="scroll"
                style={{ scrollbarWidth: "none" }}
              >
                <Messages messages={messages} />
              </Flex>
            )}

            <FormControl
              mt="3"
              id="new-message"
              onKeyDown={sendMessage}
              isRequired
            >
              <Input
                value={newMessage}
                placeholder="Enter a message and then press ENTER to send..."
                onChange={handleTyping}
                variant="filled"
                bg={colorMode === "dark" ? "#557B83" : "#F4FCD9"}
              />
              <InputRightElement>
                <EmojiModal
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                />
              </InputRightElement>
            </FormControl>
          </Flex>
        </>
      ) : (
        <Flex alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl">Click on a user or group to start chatting</Text>
        </Flex>
      )}
    </Box>
  );
};

export default ChatBox;
