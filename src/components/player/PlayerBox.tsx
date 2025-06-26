import { Box, Image, Portal } from '@chakra-ui/react';
import { usePlayer } from './PlayerContext';

export default function PlayerBox() {
  const { currentPlayer, currentEmote } = usePlayer();
  // Render all emote images, but only display the current one
  return (
    <Portal>
      <Box  borderColor="gray.800" position="fixed" bottom="24px" left="20%" zIndex={1000} bg="transparent" boxShadow="none" p={0} m={0}>
        {Object.entries(currentPlayer.emotes).map(([emote, src]) => (
          <Image
            key={emote}
            objectFit={""}
            src={src}
            alt={currentPlayer.name + ' ' + emote}
            width="400px"
            height={"300px"}
            style={{ display: emote === currentEmote ? 'block' : 'none', top: 0, left: 0 }}
            draggable={false}
          />
        ))}
      </Box>
    </Portal>
  );
}
