import { CloseIcon } from "@chakra-ui/icons";
import { Badge, Text } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";

const UserBadge = ({
  badgeUser,
  adminId,
  handleClickFunction,
  handleCloseFunction,
}) => {
  const { user } = ChatState();

  return (
    <Badge
      d="flex"
      flexWrap="wrap"
      alignItems="center"
      cursor="pointer"
      px="2"
      py="1"
      m="1"
      mb="2"
      fontSize="12"
      variant="solid"
      colorScheme="purple"
      borderRadius="lg"
    >
      <Text onClick={handleClickFunction}>
        {badgeUser.username}
        {adminId === badgeUser._id && <span> (Admin)</span>}
      </Text>
      {adminId === user._id && (
        <CloseIcon pl={1} onClick={handleCloseFunction} />
      )}
    </Badge>
  );
};

export default UserBadge;
