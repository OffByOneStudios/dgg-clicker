import React from "react";
import { Portal, Box, Text, Button } from "@chakra-ui/react";
import { FaX } from "react-icons/fa6";
import { useShopDrawer } from "./ShopDrawerContext";
import { ShopMenu } from "./ShopMenu";
import { consumableShopItems } from "../sys/simulation/types";
import { useClicker } from "../sys/simulation";

export function ShopDrawer() {
  const { isOpen, close } = useShopDrawer();
  const { money, buyItem } = useClicker();

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
        <Box position="absolute" zIndex={"modal"} top={6} right={8}>
          <FaX size={24} cursor="pointer" color="black" onClick={close} />
        </Box>
        <Box position="absolute" zIndex={1100} top={6} right={8}>
          <FaX size={24} cursor="pointer" color="white" onClick={close} />
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
            Shop
          </Text>
        </Box>
        <ShopMenu />
        <Box
          position="absolute"
          top={0}
          right={0}
          w={{ base: "100%", md: "50%" }}
          h="100%"
          p={8}
          overflowY="auto"
        >
          {consumableShopItems.map((item) => {
            const canAfford = money >= item.cost;
            return (
              <Button
                key={item.id}
                disabled={!canAfford}
                colorScheme={canAfford ? "blue" : "gray"}
                onClick={() => buyItem(item.id)}
                opacity={canAfford ? 1 : 0.5}
                mb={2}
                w="100%"
              >
                {item.name} - {item.description}
              </Button>
            );
          })}
        </Box>
      </Box>
    </Portal>
  );
}
