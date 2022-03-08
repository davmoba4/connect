import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
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
import React, { useState } from "react";

const SignUp = () => {
  const { colorMode } = useColorMode();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [picture, setPicture] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = () => {};

  const handlePicUpload = () => {};

  return (
    <VStack spacing="5">
      <FormControl id="username-sign-up" isRequired>
        <FormLabel>Username</FormLabel>
        <Input
          value={username}
          placeholder="Enter your username"
          onChange={(e) => setUsername(e.target.value)}
          backgroundColor={colorMode === "dark" ? null : "#FFFBE9"}
        />
      </FormControl>
      <FormControl id="password-sign-up" isRequired>
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
      <FormControl id="password-confirm-sign-up" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            value={passwordConfirm}
            placeholder="Confirm your password"
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPasswordConfirm(e.target.value)}
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
      <FormControl id="picture">
        <FormLabel>Profile Picture (optional)</FormLabel>
        <Input
          p="1"
          backgroundColor={colorMode === "dark" ? null : "#FFFBE9"}
          type="file"
          accept="image/*"
          onChange={(e) => handlePicUpload(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="orange"
        width="100%"
        style={{ marginTop: "30px" }}
        onClick={handleSignUp}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
