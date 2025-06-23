import ClickButton from '../click';
import { Flex, Text } from '@chakra-ui/react';
import { useClicker } from './simulation/index';
import MenuBar from './menu';
import ComponentMenu from './ComponentMenu';
import ChatWindow from '../chat/ChatWindow';
import PlayerBox from '../player/PlayerBox';
import { usePlayer } from '../player/PlayerContext';


function GameView() {
   const { score, handleClick, components } = useClicker();
   const { transition } = usePlayer();
   const scorePerSecond = components.reduce((sum, c) => sum + c.pointsPerSecond * c.owned, 0);
   const handleClickWithAnim = () => {
     transition('IdleMouthOpen', 100);
     handleClick();
   };
  return (
    <Flex flex={1} maxH={"80vh"} direction="row" m="2em" borderColor={"gray.800"} borderWidth="32px" borderRadius="md" boxShadow="md">
        <ComponentMenu />
        <Flex flex={1} direction="column" align="center" justify="center">
          <Text fontSize="2xl" mb={2} fontWeight="semibold">Score: {Math.floor(score)}</Text>
          <Text fontSize="lg" mb={4} color="gray.600">Per Second: {Math.floor(scorePerSecond)}</Text>
          <ClickButton onClick={handleClickWithAnim} />
        </Flex>
        <ChatWindow />
    </Flex>
  )
}


export default function Shell() {
 

  return (
    <Flex direction="column" minH="100vh">
      <MenuBar />
      <GameView />
      <PlayerBox />
      {/* Monitor Stand */}
      <Flex direction="column" align="center" mt={-8} zIndex={0}>
        <Flex
          w="64px"
          h="64px"
          bg="gray.800"
          boxShadow="md"
          mb={-4}
        />
        <Flex
          w="256px"
          h="50px"
          bg="gray.800"
          borderRadius="full"
          boxShadow="md"
        />
      </Flex>
    </Flex>
  );
}
