import { Flex, Text } from '@chakra-ui/react';
import MenuDrawer from './MenuDrawer';

export default function MenuBar() {
  return (
    <Flex as="nav" bg="blue.700" color="white" px={6} py={4} align="center" justify="space-between" boxShadow="md" position="relative">
      <Text fontWeight="bold" fontSize="xl">ClickJam</Text>
      <MenuDrawer />
    </Flex>
  );
}
