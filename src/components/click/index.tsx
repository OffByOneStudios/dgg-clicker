import { Button } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState } from "react";
import { useAudioEngine } from "../sys/audio/AudioEngine";

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(66,153,225, 0.7); }
  70% { box-shadow: 0 0 0 20px rgba(66,153,225, 0); }
  100% { box-shadow: 0 0 0 0 rgba(66,153,225, 0); }
`;

export default function ClickButton({ onClick }: { onClick?: () => void }) {
  const [isPressed, setIsPressed] = useState(false);
  const { playSfx } = useAudioEngine();

  const handleClick = () => {
    playSfx("/audio/sfx/soft-hitclap.wav", 0.5);
    if (onClick) onClick();
  };

  return (
    <Button
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      borderRadius="full"
      w="150px"
      h="150px"
      fontSize="3xl"
      colorPalette="blue"
      bgGradient="linear(to-br, blue.400, blue.600)"
      color="white"
      boxShadow="lg"
      animation={`${pulse} 1.2s infinite`}
      transform={isPressed ? "scale(0.95)" : "scale(1)"}
      transition="transform 0.1s"
      _active={{
        bgGradient: "linear(to-br, blue.500, blue.700)",
      }}
      _focus={{
        boxShadow: "outline",
      }}
    >
      Click!
    </Button>
  );
}
