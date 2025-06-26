import React from "react";
import { Box, Grid, Text } from "@chakra-ui/react";
import { useClicker } from "../sys/simulation/index";
import { consumableShopItems } from "../sys/simulation/types";

export function ShopMenu() {
  const { money, buyItem } = useClicker();
  return (
    <Box
      position="absolute"
      top={0}
      right={0}
      h="100%"
      w={{ base: "100%", md: "50%" }}
      bg="rgba(255,255,255,0.15)"
      boxShadow="0 4px 32px 0 rgba(0,0,0,0.15)"
      backdropFilter="blur(12px)"
      borderLeftRadius="2xl"
      border="1px solid rgba(255,255,255,0.25)"
      p={6}
      overflowY="auto"
      zIndex={1200}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Text fontWeight="bold" fontSize="2xl" color="gray.900" mb={2} textAlign="center">
        Shop Menu
      </Text>
      <Text fontSize="lg" color="green.900" mb={6} textAlign="center">
        Balance: ${money}
      </Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={6} w="100%">
        {consumableShopItems.map((item) => {
          const canAfford = money >= item.cost;
          return (
            <Box
              key={item.id}
              bg={canAfford ? "rgba(255,255,255,0.25)" : "rgba(200,200,200,0.15)"}
              borderRadius="lg"
              boxShadow="md"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              aspectRatio={1}
              w="128px"
              h="128px"
              _hover={canAfford ? { bg: "blue.100", cursor: "pointer" } : {}}
              transition="background 0.2s"
              opacity={canAfford ? 1 : 0.5}
              cursor={canAfford ? "pointer" : "not-allowed"}
              onClick={() => canAfford && buyItem(item.id)}
              border={canAfford ? "2px solid #2B6CB0" : "2px solid #aaa"}
              mb={2}
            >
              <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={1}>{item.name}</Text>
              <Text fontSize="sm" color="gray.600" mb={1}>{item.description}</Text>
              <Text fontSize="sm" color={canAfford ? "green.600" : "red.600"}>${item.cost}</Text>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
}
