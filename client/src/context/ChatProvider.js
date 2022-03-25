import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

/*
 *@description     The context provider that holds all global state variables
 *@props           children: the child components for this component (children)
 */
const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [theSocket, setTheSocket] = useState();
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  /*
   *@description     uses the setUser state function fo update the userData
   *                 state variable if it is found in local storage. If it is
   *                 not found, it navigates to the log in screen.
   *@dependency      navigate: the dom component for switching windows
   */
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("connect-user-data"));
    setUser(userData);

    if (!userData) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        fetchAgain,
        setFetchAgain,
        theSocket,
        setTheSocket,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
