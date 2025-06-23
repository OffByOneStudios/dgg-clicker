import { Box, Image, Portal } from '@chakra-ui/react';
import { usePlayer } from './PlayerContext';

export default function PlayerBox() {
  const { currentPlayer, currentEmote } = usePlayer();
  const imgSrc = currentPlayer.emotes[currentEmote];
  return (
    <Portal>
      <Box  borderColor="gray.800" position="fixed" bottom="24px" left="20%" zIndex={1000} bg="transparent" boxShadow="none" p={0} m={0}>
        <Image objectFit={""} src={imgSrc} alt={currentPlayer.name + ' ' + currentEmote} width="400px" height={"300px"} />
      </Box>
    </Portal>
  );
}
