import { useState } from "react";
import { Box, IconButton, Button, Stack, Text, Drawer, Portal } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { useClicker } from "./simulation/index";
import { ResetDialog } from "./ResetDialog";

export default function MenuDrawer() {
  const { resetGame } = useClicker() as any;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Drawer.Root open={drawerOpen} onOpenChange={d => setDrawerOpen(d.open)}>
      <Drawer.Trigger asChild>
        <IconButton
          aria-label="Open menu"
          variant="ghost"
          position="absolute"
          top={2}
          right={2}
          zIndex={100}
        >
          <FaBars />
        </IconButton>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Menu</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              {/* Add more menu items here if needed */}
            </Drawer.Body>
            <Drawer.Footer>
              <Button colorPalette="red" w="100%" onClick={() => setDialogOpen(true)}>
                Reset Score
              </Button>
              <ResetDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onReset={() => {
                  resetGame();
                  setDrawerOpen(false);
                }}
              />
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <Button variant="ghost" position="absolute" top={2} right={2}>Close</Button>
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
