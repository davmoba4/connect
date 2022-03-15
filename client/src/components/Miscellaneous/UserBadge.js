import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/react";

const UserBadge = ({ user, handleFunction }) => {
  return (
    <Badge
      cursor="pointer"
      px="2"
      py="1"
      m="1"
      mb="2"
      fontSize="12"
      variant="solid"
      colorScheme="purple"
      borderRadius="lg"
      onClick={handleFunction}
    >
      {user.username}
      <CloseIcon pl={1} />
    </Badge>
  );
};

export default UserBadge;
