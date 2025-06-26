import { Button, Box, Flex, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useEffect, useRef, useState } from "react";
import { useAudioEngine } from "../sys/audio/AudioEngine";
import { useClicker } from "../sys/simulation";
import { usePlayer } from "../player/PlayerContext";
import { FaPlay, FaPause, FaVolumeUp, FaCircle, FaUser, FaStore, FaFlask, FaSatellite } from "react-icons/fa";
import { ResearchDrawer } from "../research/ResearchDrawer";
import { useResearchDrawer } from "../research/ResearchDrawerContext";
import { useShopDrawer } from "../shop/ShopDrawerContext";
import { FaBagShopping } from "react-icons/fa6";
import { InventoryPanel, InventoryPanelProvider, useInventoryContext } from "../inventory/InventoryPanel";

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(66,153,225, 0.7); }
  70% { box-shadow: 0 0 0 20px rgba(66,153,225, 0); }
  100% { box-shadow: 0 0 0 0 rgba(66,153,225, 0); }
`;

export function ClickButton() {
  const { handleClick } = useClicker();
  const { transition } = usePlayer();
  const [isPressed, setIsPressed] = useState(false);
  const { playSfx } = useAudioEngine();

  const onClick = () => {
    playSfx("/audio/sfx/soft-hitclap.wav", 0.5);
    transition("IdleMouthOpen", 100);
    handleClick();
  };

  return (
    <Button
      onClick={onClick}
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

function BottomViewerControls() {
  const { components, paused, setPaused } = useClicker();
  const viewers = components.find((c) => c.id === "viewer")?.owned || 0;
  const { globalVolume, setGlobalVolume } = useAudioEngine();

  const handlePlayPause = () => setPaused((p) => !p);

  return (
    <Flex
      position="absolute"
      bottom={0}
      right={0}
      height="auto"
      width="auto"
      px={4}
      py={3}
      align="center"
      bg="rgba(0,0,0,0.0)"
      justify="flex-end"
      direction="row"
      zIndex={2}
    >
      <Flex align="center" gap={4}>
        <Box
          as="button"
          aria-label={paused ? "Play" : "Pause"}
          onClick={handlePlayPause}
          color="white"
          fontSize="xl"
          mr={2}
        >
          {paused ? <FaPlay /> : <FaPause />}
        </Box>
        <Flex align="center" gap={1}>
          <FaCircle color={paused ? "#888" : "#f00"} style={{ marginRight: 4 }} />
          <Text
            color={paused ? "gray.400" : "red.400"}
            fontWeight="bold"
            fontSize="sm"
            letterSpacing="wide"
          >
            LIVE
          </Text>
        </Flex>
        <FaVolumeUp color="white" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={globalVolume}
          onChange={(e) => setGlobalVolume(Number(e.target.value))}
          style={{ width: 80 }}
        />
        <Flex align="center" gap={1} ml={2}>
          <FaUser style={{ color: "white", display: "inline", marginRight: 4 }} />
          <Text
            color="white"
            fontWeight="bold"
            fontSize="sm"
            textShadow="0 2px 8px #000"
          >
            {viewers} viewers
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

function ScorePanel() {
  const { score, money, research, components } = useClicker();


  const animatedScore = useAnimatedNumber(score, 300);

  return (
    <Box
      position="absolute"
      top={4}
      left={4}
      bg="rgba(0,0,0,0.6)"
      borderRadius="md"
      px={4}
      py={2}
      zIndex={3}
      boxShadow="md"
      minW="200px"
    >
      <Text fontSize="2xl" fontWeight="semibold" color="white" textShadow="0 2px 8px #000">
        Score: {animatedScore}
      </Text>
      <Text fontSize="md" color="yellow.200" textShadow="0 2px 8px #000" mt={2}>
        Money: {money.toFixed(2)}
      </Text>
      <Text fontSize="md" color="blue.200" textShadow="0 2px 8px #000">
        Research: {research.toFixed(2)}
      </Text>
    </Box>
  );
}

function DesktopIcon({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <Box
      cursor={"pointer"}
      as="button"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={2}
      borderRadius="md"
      bg="transparent"
      _hover={{ bg: "rgba(66,153,225,0.15)", color: "white" }}
      color="white"
      minW="56px"
      onClick={onClick}
      transition="background 0.2s"
    >
      {icon}
      <Text fontSize="xs" mt={1} fontWeight="semibold" textShadow="0 2px 8px #000">
        {label}
      </Text>
    </Box>
  );
}

function DesktopIconGrid() {
  const { open: openResearch } = useResearchDrawer();
  const { open: openShop } = useShopDrawer();
  const { open: openInventory } = useInventoryContext();
  const icons = [
    { label: "Shop", icon: <FaStore size={28} />, onClick: openShop },
    { label: "Research", icon: <FaFlask size={28} />, onClick: openResearch },
    { label: "Inventory", icon: <FaBagShopping size={28} />, onClick: openInventory },
    { label: "Orbiters", icon: <FaSatellite size={28} />, onClick: () => {/* TODO: open orbiters */ } },
  ];
  return (
    <Flex
      position="absolute"
      top={4}
      right={4}
      direction="row"
      gap={3}
      zIndex={3}
      bg="transparent"
      borderRadius="md"
      px={1}
      py={1}
    >
      {icons.map((item) => (
        <DesktopIcon key={item.label} label={item.label} icon={item.icon} onClick={item.onClick} />
      ))}
    </Flex>
  );
}

export function ClickButtonPanel() {

  return (
    <InventoryPanelProvider>
      <Flex
        flex={1}
        direction="column"
        align="center"
        justify="center"
        position="relative"
        minH="0"
        bgImage="url('/img/bg/pepe.webp')"
        bgSize="cover"
        backgroundPosition="center"
        borderRadius="lg"
        boxShadow="xl"
        overflow="hidden"
      >
        <ScorePanel />
        <DesktopIconGrid />

        <InventoryPanel />
        <Flex
          direction="column"
          align="center"
          justify="center"
          flex={1}
          w="100%"
          h="100%"
          pt={8}
        >
          <ClickButton />
          <BottomViewerControls />
        </Flex>
      </Flex>
    </InventoryPanelProvider>
  );
}

// Animated number hook for smooth counter
export function useAnimatedNumber(target: number, duration = 300) {
  const [display, setDisplay] = useState(target);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    let initial = display;

    function animate(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setDisplay(initial + (target - initial) * progress);
      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      } else {
        setDisplay(target);
      }
    }

    raf.current = requestAnimationFrame(animate);
    return () => {
      if (raf.current !== null) {
        cancelAnimationFrame(raf.current);
      }
    };
  }, [target, duration]);

  return Math.floor(display);
}
