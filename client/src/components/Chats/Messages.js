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

const Messages = ({ messages }) => {
  const { colorMode } = useColorMode();
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <Flex flexDir="column">
            <div style={{ display: "flex" }} key={m._id}>
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
                new Date(m.createdAt).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
            </Text>
          </Flex>
        ))}
    </ScrollableFeed>
  );
};

export default Messages;
