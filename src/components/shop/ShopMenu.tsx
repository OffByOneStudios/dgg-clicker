import React from "react";
import { Box, Grid, Text } from "@chakra-ui/react";
import { FaUser, FaUserPlus, FaStar, FaShieldAlt, FaCrown, FaGift, FaRobot, FaHeart, FaMicrophone, FaTrophy } from "react-icons/fa";

const shopIcons = [
  FaUser, FaUserPlus, FaStar, FaShieldAlt, FaCrown, FaGift, FaRobot, FaHeart, FaMicrophone, FaTrophy
];

export function ShopMenu() {
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
      <Text fontWeight="bold" fontSize="2xl" color="gray.900" mb={6} textAlign="center">
        Shop Menu
      </Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={6} w="100%">
        {shopIcons.map((Icon, i) => (
          <Box
            key={i}
            bg="rgba(255,255,255,0.25)"
            borderRadius="lg"
            boxShadow="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            aspectRatio={1}
            w="128px"
            h="128px"
            _hover={{ bg: "blue.100" }}
            transition="background 0.2s"
            cursor="pointer"
          >
            <Icon size={24} color="#2B6CB0" />
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
