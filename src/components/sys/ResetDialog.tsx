import { Button, Dialog, Portal, Stack } from "@chakra-ui/react";
import React from "react";

interface ResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
}

export function ResetDialog({ open, onOpenChange, onReset }: ResetDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={d => onOpenChange(d.open)} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p={8} borderRadius="lg">
            <Stack gap="4">
              <Dialog.Title fontSize="2xl" fontWeight="bold" mb={2}>Reset Score</Dialog.Title>
              <Dialog.Description fontSize="md" color="gray.600">Are you sure? This will set your score to zero. This cannot be undone.</Dialog.Description>
              <Stack direction="row" gap="2" justify="end">
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button colorPalette="red" onClick={() => { onReset(); onOpenChange(false); }}>Reset</Button>
              </Stack>
            </Stack>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
