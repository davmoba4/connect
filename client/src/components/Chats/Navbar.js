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
import { ChevronDownIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import logo from "../../assets/logo.png";
import { ChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileModal from "../Miscellaneous/ProfileModal";

/*
 *@description     The component that holds the logo, option to toggle color mode, and user options
 */
const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const { user } = ChatState();

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
        <Tooltip label="Toggle color mode" hasArrow placement="bottom-end">
          <Button
            ml="2"
            onClick={hardToggleColorMode}
            bg={colorMode === "dark" ? null : "#FBF8F1"}
          >
            {colorMode === "dark" ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Tooltip>

        <Menu>
          <MenuButton
            as={Button}
            ml="2"
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
            <MenuDivider />
            <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Flex>
  );
};

export default Navbar;
