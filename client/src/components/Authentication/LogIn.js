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
  VStack,
} from "@chakra-ui/react";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";

const LogIn = () => {
  const { colorMode } = useColorMode();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingLogIn, setLoadingLogIn] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const logInByEnter = (event) => {
    if (event.key === "Enter") {
      handleLogIn();
    }
  };

  const handleLogIn = () => {};

  const handleGuest = () => {};

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
