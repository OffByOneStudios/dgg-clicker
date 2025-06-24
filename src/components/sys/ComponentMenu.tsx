import { Box, Text, Button, VStack, HStack } from '@chakra-ui/react';
import { useClicker } from './simulation/index';
import { componentIcons } from './simulation/defaultComponents';
import { useAudioEngine } from './audio/AudioEngine';
import { usePlayer } from '../player/PlayerContext';

function getComponentCurrentCost(comp: any) {
  // Defensive: If owned is undefined or not a number, treat as 0
  const owned = typeof comp.owned === 'number' && !isNaN(comp.owned) ? comp.owned : 0;
  const cost = typeof comp.cost === 'number' && !isNaN(comp.cost) ? comp.cost : 1;
  const costFactor = typeof comp.costFactor === 'number' && !isNaN(comp.costFactor) ? comp.costFactor : 1.15;
  return Math.ceil(cost * Math.pow(costFactor, owned));
}

function ComponentMenuItem({ comp, buyComponent, score, canAfford, isLocked }: any) {
  const { playSfx } = useAudioEngine();
  const { transition } = usePlayer();
  const currentCost = getComponentCurrentCost(comp);
  const totalPps = comp.owned * comp.pointsPerSecond;
  const handleBuy = () => {
    transition('Happy', 100);
    playSfx("/audio/sfx/combobreak.wav", 0.5);
    buyComponent(comp.id);
  };
  return (
    <HStack
      key={comp.id}
      gap={4}
      p={3}
      bg="white"
      borderRadius="md"
      boxShadow="sm"
      justifyContent="space-between"
      opacity={isLocked ? 0.5 : 1}
      filter={isLocked ? 'grayscale(0.7)' : 'none'}
      pointerEvents={isLocked ? 'none' : 'auto'}
      transition="opacity 0.2s, filter 0.2s"
    >
      <HStack gap={3}>
        {componentIcons[comp.id]}
        <Box>
          <Text fontWeight="semibold">{comp.name}</Text>
          <Text fontSize="sm" color="gray.500">+{comp.pointsPerSecond} /s</Text>
          <Text fontSize="xs" color="gray.400">Owned: {comp.owned}</Text>
          <Text fontSize="sm" color="green.500" fontWeight="bold">
            Total: {totalPps} /s
          </Text>
        </Box>
      </HStack>
      <Button
        size="sm"
        colorPalette="blue"
        onClick={handleBuy}
        disabled={!canAfford}
      >
        Buy ({currentCost})
      </Button>
    </HStack>
  );
}

export default function ComponentMenu() {
  const { components, buyComponent, score } = useClicker();

  // Find the most expensive owned component (by index, not cost)
  const lastOwnedIdx = (() => {
    let idx = -1;
    components.forEach((c, i) => { if (c.owned > 0) idx = i; });
    return idx;
  })();

  // Only show up to the first locked component after the last owned
  const visibleComponents = components.filter((c, i) => {
    if (c.owned > 0) return true;
    if (lastOwnedIdx === -1) return i === 0; // show only the first if nothing owned
    return i <= lastOwnedIdx + 1;
  });

  return (
    <Box bg="gray.50" w="320px" overflowY="auto" p={4} boxShadow="md" borderRight="4px solid #4A5568">
      <Text fontWeight="bold" fontSize="2xl" mb={4} textAlign="left" pl={1} letterSpacing="wide">Upgrades</Text>
      <VStack gap={4} alignItems="stretch">
        {visibleComponents.map(comp => {
          const currentCost = getComponentCurrentCost(comp);
          const canAfford = score >= currentCost;
          const isLocked = comp.owned === 0 && !canAfford;
          return (
            <ComponentMenuItem
              key={comp.id}
              comp={comp}
              buyComponent={buyComponent}
              score={score}
              canAfford={comp.owned > 0 ? canAfford : canAfford}
              isLocked={isLocked}
            />
          );
        })}
      </VStack>
    </Box>
  );
}
