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
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [picture, setPicture] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePicUpload = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please select an image",
        status: "warning",
        position: "bottom",
        duration: 10000,
        isClosable: true,
      });
      return;
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "connect");
      data.append("cloud_name", "disclcylm");
      fetch("https://api.cloudinary.com/v1_1/disclcylm/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPicture(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          toast({
            title: "Could not upload the picture",
            status: "warning",
            position: "bottom",
            duration: 10000,
            isClosable: true,
          });
          setLoading(false);
        });
    } else {
      toast({
        title: "Please only upload a PNG, JPG, or JPEG image format",
        status: "warning",
        position: "bottom",
        duration: 10000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);

    if (!username || !password || !passwordConfirm) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        position: "bottom",
        duration: 10000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (password !== passwordConfirm) {
      toast({
        title: "Passwords don't match",
        status: "warning",
        position: "bottom",
        duration: 10000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const { config } = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const darkModeSetting = colorMode === "dark";
      const { data } = await axios.post(
        "/api/user/sign-up",
        { username, password, picture, darkModeSetting },
        config
      );
      toast({
        title: "You have successfully registered!",
        status: "success",
        position: "bottom",
        duration: 10000,
        isClosable: true,
      });

      localStorage.setItem("connect-user-data", JSON.stringify(data));
      setLoading(false);
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
      setLoading(false);
    }
  };

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
