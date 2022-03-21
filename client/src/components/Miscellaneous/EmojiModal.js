import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";

const EmojiModal = ({ newMessage, setNewMessage }) => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  var codePoints = Array.from(new Array(50), (x, i) => i + 600);
  codePoints = codePoints.concat(Array.from(new Array(30), (x, i) => i + 910));
  codePoints = codePoints.concat(Array.from(new Array(2), (x, i) => i + 970));
  codePoints = codePoints.concat(Array.from(new Array(4), (x, i) => i + 973));
  codePoints = codePoints.concat(["44D", "44E", "44A", "44F", "64C", "64F"])

  return (
    <>
      <Tooltip label="Choose from emojis" hasArrow placement="bottom-end">
        <Button
          fontSize="2xl"
          pt="0.5"
          pr="3.5"
          onClick={onOpen}
          borderWidth="1px"
          bg={colorMode === "dark" ? null : "#FBF8F1"}
        >
          {String.fromCodePoint(0x1f600)}
        </Button>
      </Tooltip>
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="400px">
          <ModalHeader mb="5" />
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexWrap="wrap"
            alignItems="center"
            overflowY="scroll"
            justifyContent="space-between"
          >
            {codePoints.map((c) => (
              <Button
                key={c}
                fontSize="xl"
                mb="2"
                onClick={(event) => {
                  setNewMessage(newMessage + event.target.innerHTML);
                }}
              >
                {String.fromCodePoint("0x1f" + c)}
              </Button>
            ))}
          </ModalBody>
          <ModalFooter mb="2" fontSize="xs">* Scroll for more...</ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EmojiModal;
