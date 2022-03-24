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

/*
 *@description     The component that holds the chat messages and
 *                 the chat message input for a particular chat
 */
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

  /*
   *@description     Uses the selectedChat state variable to fetch all
   *                 of the messages for that particular chat. It sends
   *                 a GET request to /api/message/<selected chat ID>
   */
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

  /*
   *@description     Calls the function that handles the sending of a
   *                 message if the enter key was pressed
   */
  const sendMessageByEnter = async (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };
  /*
   *@description     Handles the sending message function. It uses
   *                 the selectedChat and newMessage state variables
   *                 to send a POST request to /api/message. It also
   *                 emits to the socket that the user has stopped
   *                 typing.
   */
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

  /*
   *@description     Handles the typing function. It sets the newMessage state
   *                 variable to the event's value. Then it sets a timeout so
   *                 that the "self is typing" and "self stopped typing" messages
   *                 are emitted according to whether the user is still typing
   */
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

  /*
   *@description     Handles the read message function. It sends a PUT request
   *                 to /api/message/read to update the given message to read by
   *                 the current user
   *@params          message: the message to update (Message)
   */
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

  /*
   *@description     Sets up the socket connection to the given ENDPOINT.
   *                 Also manages the "other is typing" and "other stopped
   *                 typing" socket events
   */
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

  /*
   *@description     Uses the roomWhereTyping, selectedChat, and otherIsTyping
   *                 state variables to determine whether to display the
   *                 typing indicator for when another user is typing
   *@dependency      checkTyping: a state variable that calls for the update
   *                 of the typing indicator display (Boolean)
   */
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

  /*
   *@description     Calls the fetchMessages function whenever a new chat
   *                 is selected. Also sets the selectedChatCompare variable
   *                 to the selectedChat state variable so that it can hold
   *                 the current state for comparisons
   *@dependency      selectedChat: the state variable that holds the current
   *                 chat that is selected (Chat)
   */
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  /*
   *@description     manages the "message received" event from the socket.
   *                 This activates whenever a new message is received by
   *                 the current user. It also handles the "other read message"
   *                 socket event that activates whenever another user read the
   *                 current user's message
   */
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

  /*
   *@description     Fetches the current chat's messages whenever another
   *                 user read the latest message to display the read receipt
   *@dependency      otherReadMessage: the state variable that updates whether
   *                 another user read the current user's latest message (Boolean)
   */
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
