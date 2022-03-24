import {
  Box,
  Button,
  Container,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import React, { useEffect } from "react";
import logo from "../../assets/logo.png";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import { useNavigate } from "react-router-dom";

/*
 *@description     The main page seen at login containing the LogIn and SignUp
 *                 components
 */
const AuthPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  /*
   *@description     Gets the stored user data and if it exists, navigates
   *                 to the chats page. (can't log in if already did so)
   *@dependency      navigate: the dom component for switching windows
   */
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("connect-user-data"));

    if (userData) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl">
      <Flex justify="right">
        <Tooltip label="Toggle color mode" hasArrow placement="bottom-end">
          <Button mt="5" onClick={toggleColorMode}>
            {colorMode === "dark" ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Tooltip>
      </Flex>

      <Flex
        justifyContent="center"
        w="100%"
        mt="10"
        p="3"
        borderWidth="2px"
        borderRadius="10"
        borderColor={colorMode === "dark" ? "teal" : "gray"}
        backgroundColor={colorMode === "dark" ? null : "#E5E3C9"}
      >
        <img
          src={logo}
          style={{
            maxWidth: "82px",
            maxHeight: "50px",
            margin: "10px 10px 0 0",
          }}
          alt="logo"
        />
        <Text fontSize="5xl">connect</Text>
      </Flex>

      <Box
        w="100%"
        p="3"
        mt="5"
        borderWidth="2px"
        borderRadius="10"
        borderColor={colorMode === "dark" ? "teal" : "gray"}
        backgroundColor={colorMode === "dark" ? null : "#E5E3C9"}
      >
        <Tabs isFitted variant="soft-rounded" colorScheme="cyan">
          <TabList mb="1em">
            <Tab color={colorMode === "dark" ? "white" : "#789395"}>Log In</Tab>
            <Tab color={colorMode === "dark" ? "white" : "#789395"}>
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <LogIn />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default AuthPage;
