import React from "react";
import { ChatState } from "../../context/ChatProvider";
import ScrollableFeed from "react-scrollable-feed";
import {
  isFromSameUser,
  isOtherLastMessage,
  isOtherSenderEnd,
  senderMargin,
} from "../../config/ChatLogic";
import { Avatar, Flex, Text, Tooltip, useColorMode } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

/*
 *@description     The component that holds all of a particular chat's messages
 *@props           messages: the messages to be displayed (list of Message)
 */
const Messages = ({ messages }) => {
  const { colorMode } = useColorMode();
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <Flex flexDir="column" key={m._id}>
            <div style={{ display: "flex" }}>
              {(isOtherSenderEnd(messages, m, i, user._id) ||
                isOtherLastMessage(messages, i, user._id)) && (
                <Tooltip
                  label={m.sender.username}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="5"
                    mr="1"
                    size="sm"
                    name={m.sender.username}
                    src={m.sender.picture}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id
                      ? colorMode === "dark"
                        ? "#019267"
                        : "#B9F5D0"
                      : colorMode === "dark"
                      ? "#488FB1"
                      : "#BEE3F8"
                  }`,
                  marginLeft: senderMargin(messages, m, i, user._id),
                  marginTop: isFromSameUser(messages, m, i, user._id) ? 10 : 20,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
                {m.content}
              </span>
            </div>
            <Text fontSize="xs" ml={m.sender._id === user._id ? "auto" : "30"}>
              {new Date(m.createdAt).toLocaleDateString() +
                " - " +
                new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </Text>
            {i === messages.length - 1 &&
              m.sender._id === user._id &&
              m.readBy.length === m.chat.users.length && (
                <div style={{ display: "flex", marginLeft: "auto" }}>
                  <CheckIcon mr="1" /> <Text fontSize="xs">READ</Text>
                </div>
              )}
          </Flex>
        ))}
    </ScrollableFeed>
  );
};

export default Messages;
