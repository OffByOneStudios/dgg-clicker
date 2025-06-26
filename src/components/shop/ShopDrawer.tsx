import React from "react";
import { Portal, Box, Text } from "@chakra-ui/react";
import { FaX } from "react-icons/fa6";
import { useShopDrawer } from "./ShopDrawerContext";
import { ShopMenu } from "./ShopMenu";

export function ShopDrawer() {
  const { isOpen, close } = useShopDrawer();
  if (!isOpen) return null;
  return (
    <Portal>
      <Box
        position="fixed"
        top={0}
        left={0}
        w="100vw"
        h="100vh"
        zIndex={1000}
        bgImage={`url('/img/bg/shop.png')`}
        color="white"
        display="flex"
        flexDirection="row"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Box position="absolute" zIndex={1100} top={6} right={8}>
          <FaX
            size={24}
            cursor="pointer"
            color="white"
            onClick={close}
          />
        </Box>
        <Box
          position="absolute"
          top={0}
          left={0}
          w={{ base: "100%", md: "50%" }}
          h="100%"
          display="flex"
          alignItems="flex-start"
          justifyContent="flex-start"
          p={8}
        >
          <Text fontSize="3xl" fontWeight="bold" mb={4} color="white">
            
          </Text>
        </Box>
        <ShopMenu />
      </Box>
    </Portal>
  );
}
