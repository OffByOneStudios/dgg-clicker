import {ClickButtonPanel} from '../click';
import { Flex, Text } from '@chakra-ui/react';
import { useClicker } from './simulation/index';
import MenuBar from './menu';
import ComponentMenu from './ComponentMenu';
import ChatWindow from '../chat/ChatWindow';
import PlayerBox from '../player/PlayerBox';
import { usePlayer } from '../player/PlayerContext';
import { ResearchDrawer } from '../research/ResearchDrawer';
import { useResearchDrawer } from '../research/ResearchDrawerContext';
import { ShopDrawer } from '../shop/ShopDrawer';



function GameView() {
   const { score, components } = useClicker();
   const { transition } = usePlayer();
   const scorePerSecond = components.reduce((sum, c) => sum + c.pointsPerSecond * c.owned, 0);
   const handleClickWithAnim = () => {
     transition('IdleMouthOpen', 100);
   };
  return (
    <Flex flex={1} maxH={"80vh"} direction="row" m="2em" borderColor={"gray.800"} borderWidth="32px" borderRadius="md" boxShadow="md">
        <ComponentMenu />
        <ClickButtonPanel />
        <ChatWindow />
    </Flex>
  )
}


export default function Shell() {
  return (
    <Flex direction="column" minH="100vh">
      <ResearchDrawer />
      <ShopDrawer />
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
