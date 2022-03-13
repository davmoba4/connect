import React from "react";
import {
  Avatar,
  Box,
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

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const { user } = ChatState();

  const handleLogOut = () => {
    localStorage.removeItem("connect-user-data");
    navigate("/");
  };

  return (
    <Box
      d="flex"
      justifyContent="space-between"
      alightItems="center"
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
            margin: "10px 10px 0 0",
          }}
        />
        <Text fontSize="4xl">connect</Text>
      </Flex>

      <div>
        <Tooltip label="Toggle color mode" hasArrow placement="bottom-end">
          <Button
            mt="2"
            onClick={toggleColorMode}
            bg={colorMode === "dark" ? null : "#FBF8F1"}
          >
            {colorMode === "dark" ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Tooltip>
        <Menu>
          <MenuButton
            as={Button}
            mt="2"
            ml="1"
            bg={colorMode === "dark" ? null : "#FBF8F1"}
            rightIcon={<ChevronDownIcon />}
          >
            <Flex>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.username}
                src={user.picture}
              />
              <Text mt="2" ml="1">
                {user.username}
              </Text>
            </Flex>
          </MenuButton>
          <MenuList>
            {/* <ProfileModal user={user}> */}
            <MenuItem>My Profile</MenuItem> {/* </ProfileModal> */}
            <MenuDivider />
            <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>
  );
};

export default Navbar;
