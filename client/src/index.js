import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import ChatProvider from "./context/ChatProvider";

ReactDOM.render(
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <ChatProvider>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChatProvider>
      </BrowserRouter>
    </ChakraProvider>,
  document.getElementById("root")
);
