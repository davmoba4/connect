import React, { useEffect } from "react";
import {
  Avatar,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import {
  BellIcon,
  CheckIcon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";
import logo from "../../assets/logo.png";
import { ChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileModal from "../Miscellaneous/ProfileModal";
import { getSenderUsername } from "../../config/ChatLogic";
import NotificationBadge, { Effect } from "react-notification-badge";

/*
 *@description     The component that holds the logo, option to toggle color mode, and user options
 */
const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const {
    user,
    setSelectedChat,
    fetchAgain,
    setFetchAgain,
    theSocket,
    notifications,
    setNotifications,
  } = ChatState();

  /*
   *@description     Fetches the color mode from the database and updates
   *                 the current color mode to match it. It sents a GET
   *                 request to /api/setting
   */
  const fetchColorMode = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/setting", config);

      if (data?.darkMode && colorMode !== "dark") {
        toggleColorMode();
      } else if (!data?.darkMode && colorMode === "dark") {
        toggleColorMode();
      }
    } catch (error) {
      return;
    }
  };

  /*
   *@description     Fetches the color mode when the page is rendered
   */
  useEffect(() => {
    fetchColorMode();
  }, []);

  /*
   *@description     It toggles the color mode and also does it for the
   *                 setting in the database by sending a get request to
   *                 /api/setting to get the id and then sends a PUT request
   *                 to /api/setting to update the setting
   */
  const hardToggleColorMode = async () => {
    toggleColorMode();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/setting", config);

      await axios.put(
        "/api/setting",
        { settingId: data._id, newDarkModeSetting: colorMode !== "dark" },
        config
      );
    } catch (error) {
      return;
    }
  };

  /*
   *@description     Handles the click of a notification. Once clicked,
   *                  the selected chat becomes that of the notification's
   *                  and the notifications for that chat go away. Also,
   *                  the newest message is marked as read.
   *@params           notification: The individual notification (Message)
   */
  const clickNotification = async (notification) => {
    setSelectedChat(notification.chat);
    setNotifications(
      notifications.filter((notif) => notif.chat._id !== notification.chat._id)
    );
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(
        "/api/message/read",
        { messageId: notification._id },
        config
      );
      setFetchAgain(!fetchAgain);
      theSocket.emit("self read message", notification.chat._id);
    } catch (error) {
      return;
    }
  };

  /*
   *@description     Handles the log out function by removing the user data
   *                 from local storage, navigating to the log in screen and
   *                 reloading the page to clear the rest of the data
   */
  const handleLogOut = () => {
    localStorage.removeItem("connect-user-data");
    navigate("/");
    window.location.reload(false);
  };

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="2px"
      bg={colorMode === "dark" ? "#072227" : "#E5E3C9"}
    >
      <Flex>
        <img
          src={logo}
          style={{
            maxWidth: "66px",
            maxHeight: "40px",
            margin: "6px 6px 0 0",
          }}
          alt="logo"
        />
        <Text fontSize="4xl">connect</Text>
      </Flex>

      <div>
        <Menu>
          <MenuButton
            as={Button}
            p="1"
            bg={colorMode === "dark" ? null : "#FBF8F1"}
            borderRadius="5"
          >
            <NotificationBadge
              count={notifications.length}
              effect={Effect.SCALE}
            />
            <BellIcon fontSize="2xl" m={1} />
          </MenuButton>
          <MenuList pl="2" pr="2">
            {!notifications.length && "No new messages"}
            {notifications.map((notif) => (
              <MenuItem
                key={notif._id}
                onClick={() => {
                  clickNotification(notif);
                }}
              >
                {notif.chat.isGroupChat
                  ? `New message in ${notif.chat.chatName}`
                  : `New message from ${getSenderUsername(
                      user,
                      notif.chat.users
                    )}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            as={Button}
            ml="1"
            bg={colorMode === "dark" ? null : "#FBF8F1"}
            rightIcon={<ChevronDownIcon />}
          >
            <Avatar
              size="sm"
              cursor="pointer"
              name={user.username}
              src={user.picture}
            />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuItem onClick={hardToggleColorMode}>
              <Flex>
                <Text>Dark Mode</Text>
                {colorMode === "dark" && <CheckIcon ml="2" mt="1" />}
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Flex>
  );
};

export default Navbar;
