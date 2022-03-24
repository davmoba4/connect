import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
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
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../assets/typing-indicator.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const ChatBox = () => {
  const { colorMode } = useColorMode();
  const {
    user,
    selectedChat,
    setSelectedChat,
    fetchAgain,
    setFetchAgain,
    setTheSocket,
  } = ChatState();

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [otherReadMessage, setOtherReadMessage] = useState(false);
  const [selfIsTyping, setSelfIsTyping] = useState(false);
  const [otherIsTyping, setOtherIsTyping] = useState(false);
  const [roomWhereTyping, setRoomWhereTyping] = useState();
  const [checkTyping, setCheckTyping] = useState(false);
  const [otherIsTypingDisplayed, setOtherIsTypingDisplayed] = useState(false);

  const toast = useToast();

  const animationOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      if (selectedChatCompare !== selectedChat) {
        setLoading(true);
      }

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
      socket.emit("join chat", selectedChat._id);
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

  const sendMessageByEnter = async (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };
  const sendMessage = async () => {
    if (newMessage) {
      socket.emit("self stopped typing", {
        chat: selectedChat,
        userId: user._id,
      });
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
        socket.emit("send message", data);
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

    if (!socketConnected || !event.nativeEvent.data) return;

    if (!selfIsTyping) {
      setSelfIsTyping(true);
      socket.emit("self is typing", { chat: selectedChat, userId: user._id });
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && selfIsTyping) {
        socket.emit("self stopped typing", {
          chat: selectedChat,
          userId: user._id,
        });
        setSelfIsTyping(false);
      }
    }, timerLength);
  };

  const readMessage = async (message) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put("/api/message/read", { messageId: message._id }, config);
      setFetchAgain((fetchAgain) => !fetchAgain);
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    setTheSocket(socket);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    socket.on("other is typing", (roomId) => {
      setOtherIsTyping(true);
      setRoomWhereTyping(roomId);
      setCheckTyping((checkTyping) => !checkTyping);
    });
    socket.on("other stopped typing", (roomId) => {
      setOtherIsTyping(false);
      setRoomWhereTyping(roomId);
      setCheckTyping((checkTyping) => !checkTyping);
    });
  }, []);

  useEffect(() => {
    if (
      selectedChat &&
      roomWhereTyping &&
      roomWhereTyping === selectedChat._id &&
      otherIsTyping
    ) {
      setOtherIsTypingDisplayed(true);
    } else if (
      selectedChat &&
      roomWhereTyping &&
      roomWhereTyping === selectedChat._id &&
      !otherIsTyping
    ) {
      setOtherIsTypingDisplayed(false);
    }
  }, [checkTyping]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        setFetchAgain((fetchAgain) => !fetchAgain);
      } else {
        setMessages((messages) => [...messages, newMessageReceived]);
        readMessage(newMessageReceived);
        socket.emit("self read message", newMessageReceived.chat._id);
      }
    });

    socket.on("other read message", () =>
      setOtherReadMessage((otherReadMessage) => !otherReadMessage)
    );
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [otherReadMessage]);

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
              mt="1"
              id="new-message"
              onKeyDown={sendMessageByEnter}
              isRequired
            >
              {otherIsTypingDisplayed && (
                <div>
                  <Lottie
                    width={70}
                    style={{ marginLeft: 0, marginBottom: 10, marginTop: 10 }}
                    options={animationOptions}
                  />
                </div>
              )}
              <Flex alignItems="center" mt="1.5">
                <Input
                  roundedRight="none"
                  value={newMessage}
                  placeholder="Enter a message and then press ENTER to send..."
                  onChange={handleTyping}
                  variant="filled"
                  bg={colorMode === "dark" ? "#557B83" : "#F4FCD9"}
                />
                <EmojiModal
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                />
                <Button
                  roundedLeft="none"
                  colorScheme="teal"
                  onClick={sendMessage}
                >
                  SEND
                </Button>
              </Flex>
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
