import { Box, Text } from '@chakra-ui/react';

export default function ChatWindow() {
  return (
    <Box
      bg="gray.800"
      borderRadius="md"
      borderWidth="2px"
      borderColor="gray.600"
      boxShadow="md"
      w="320px"
      p={3}
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <Text fontWeight="bold" color="white" mb={2}>Chat</Text>
      {/* Chat messages will go here */}
      <Box flex={1} overflowY="auto" bg="gray.900" borderRadius="sm" p={2}>
        {/* Fake chat messages placeholder */}
        <Text color="gray.300" fontSize="sm">[chat will appear here]</Text>
      </Box>
    </Box>
  );
}
