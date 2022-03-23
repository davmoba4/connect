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

  var codePoints = Array.from(new Array(50), (x, i) => "0x1F" + (i + 600));
  codePoints = codePoints.concat(
    Array.from(new Array(28), (x, i) => "0x1F" + (i + 910))
  );
  codePoints = codePoints.concat(
    Array.from(new Array(2), (x, i) => "0x1F" + (i + 970))
  );
  codePoints = codePoints.concat(
    Array.from(new Array(4), (x, i) => "0x1F" + (i + 973))
  );
  codePoints = codePoints.concat([
    "0x1F44D",
    "0x1F44E",
    "0x1F44A",
    "0x1F44F",
    "0x1F64C",
    "0x1F64F",
    "0x1F60D",
    "0x2764",
  ]);

  return (
    <>
      <Tooltip label="Choose from emojis" hasArrow placement="bottom-end">
        <Button
          fontSize="xl"
          pt="0.5"
          pr="3.5"
          onClick={onOpen}
          borderRadius="0"
          bg={colorMode === "dark" ? "#557B83" : "#F4FCD9"}
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
            style={{scrollbarWidth: "none"}}
            justifyContent="space-between"
          >
            {codePoints.map((c) => (
              <Button
                key={c}
                fontSize="xl"
                mb="2"
                onClick={(event) => {
                  c !== "0x2764"
                    ? setNewMessage(newMessage + event.target.innerHTML)
                    : setNewMessage(
                        newMessage +
                          event.target.innerHTML +
                          String.fromCodePoint(0xfe0f)
                      );
                }}
              >
                {String.fromCodePoint(c)}
              </Button>
            ))}
          </ModalBody>
          <ModalFooter mb="2" fontSize="xs">
            * Scroll for more...
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EmojiModal;
