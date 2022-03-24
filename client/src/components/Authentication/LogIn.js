import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
  useColorMode,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  names,
} from "unique-names-generator";

/*
 *@description     The component that displays the log in functions
 */
const LogIn = () => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingLogIn, setLoadingLogIn] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);

  /*
   *@description     Toggles whether or not the password is visible in
   *                 the password input
   */
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  /*
   *@description     Calls the function that handles log in if the enter
   *                 key was pressed
   */
  const logInByEnter = (event) => {
    if (event.key === "Enter") {
      handleLogIn();
    }
  };
  /*
   *@description     Handles the log in function. It uses the state variables
   *                 of username and password to send a POST request to
   *                 /api/user/login
   */
  const handleLogIn = async () => {
    setLoadingLogIn(true);
    if (!username || !password) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        position: "bottom",
        duration: 10000,
        isClosable: true,
      });
      setLoadingLogIn(false);
      return;
    }

    try {
      const { config } = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/log-in",
        { username, password },
        config
      );
      toast({
        title: "Logged in successfully!",
        status: "success",
        position: "bottom",
        duration: 10000,
        isClosable: true,
      });

      localStorage.setItem("connect-user-data", JSON.stringify(data));
      setLoadingLogIn(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.response.data.message,
        status: "error",
        position: "bottom",
        duration: 10000,
        isClosable: true,
      });
      setLoadingLogIn(false);
    }
  };

  /*
   *@description     Uses the unique-names-generator library to
   *                 generate a unique name consisting of an
   *                 adjective an animal and a name
   */
  const generateGuestUsername = () => {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, animals, names],
      separator: "",
      style: "capital",
    });
  };

  /*
   *@description     Generates a password consisting of random
   *                 upper and lowecase letters, numbers, and
   *                 special symbols
   *@params          length: the length the password should be (int)
   */
  const generateGuestPassword = (length) => {
    const CHARACTERS =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    var password = "";
    for (var i = 0; i < length; i++) {
      password += CHARACTERS.charAt(
        Math.floor(Math.random() * CHARACTERS.length)
      );
    }
    return password;
  };

  /*
   *@description     Generates the url for a randomly chosen avatar
   *                 that will be used as the profile picture for a
   *                 guest account
   */
  const generateGuestPicture = () => {
    const BASE_URL = "https://res.cloudinary.com/disclcylm/image/upload/";
    const URLS = [
      "v1646438876/guest_x2r4pw.png",
      "v1646438836/guest_ic2xwy.png",
      "v1646438803/guest_d4khep.png",
      "v1646438751/guest_tlo7es.png",
      "v1646438715/guest_u8csu3.png",
      "v1646438674/guest_q6i3uv.png",
      "v1646438560/guest_tq3wv6.png",
      "v1646438488/guest_hcjlhr.png",
      "v1646438314/guest_m1tp9q.png",
    ];
    return `${BASE_URL}${URLS[Math.floor(Math.random() * URLS.length)]}`;
  };

  /*
   *@description     Handles the creation of a guest account. It uses
   *                 the previous three functions to set up a username,
   *                 password, and picture. Then it sends a POST request
   *                 to /api/user/sign-up
   */
  const handleGuest = async () => {
    setLoadingGuest(true);

    const uname = generateGuestUsername();
    const pass = generateGuestPassword(12);
    const pic = generateGuestPicture();

    try {
      const { config } = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const darkModeSetting = colorMode === "dark";
      const { data } = await axios.post(
        "/api/user/sign-up",
        {
          username: uname,
          password: pass,
          picture: pic,
          darkModeSetting: darkModeSetting,
        },
        config
      );
      toast({
        title: "Guest account created!",
        status: "success",
        position: "bottom",
        duration: 10000,
        isClosable: true,
      });

      localStorage.setItem("connect-user-data", JSON.stringify(data));
      setLoadingGuest(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.response.data.message,
        status: "error",
        position: "bottom",
        duration: 10000,
        isClosable: true,
      });
      setLoadingGuest(false);
    }
  };

  return (
    <VStack spacing="5">
      <FormControl id="username" isRequired onKeyDown={logInByEnter}>
        <FormLabel>Username</FormLabel>
        <Input
          value={username}
          placeholder="Enter your username"
          onChange={(e) => setUsername(e.target.value)}
          backgroundColor={colorMode === "dark" ? null : "#FFFBE9"}
        />
      </FormControl>
      <FormControl id="password" isRequired onKeyDown={logInByEnter}>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            backgroundColor={colorMode === "dark" ? null : "#FFFBE9"}
          />
          <InputRightElement>
            <Tooltip
              label={showPassword ? "Hide password" : "Show password"}
              hasArrow
              placement="bottom-end"
            >
              <Button
                backgroundColor="transparent"
                onClick={toggleShowPassword}
              >
                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
              </Button>
            </Tooltip>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="teal"
        width="100%"
        style={{ marginTop: "30px" }}
        onClick={handleLogIn}
        isLoading={loadingLogIn}
      >
        Log In
      </Button>
      <Button
        colorScheme="pink"
        width="100%"
        style={{ marginTop: "10px" }}
        onClick={handleGuest}
        isLoading={loadingGuest}
      >
        Use a Guest Account
      </Button>
    </VStack>
  );
};

export default LogIn;
