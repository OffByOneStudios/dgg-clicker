import React from "react";
import { Box, Text, Grid, IconButton } from "@chakra-ui/react";
import { FaBagShopping, FaX } from "react-icons/fa6";
import { useClicker } from "../sys/simulation/index";
import { InventoryItem } from "../sys/simulation/types";


interface IventoryPanelContextType {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const IventoryPanelContext = React.createContext<IventoryPanelContextType | undefined>(undefined);

export function InventoryPanelProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <IventoryPanelContext.Provider value={{
            isOpen,
            open: () => setIsOpen(true),
            close: () => setIsOpen(false),
        }}>
            {children}
        </IventoryPanelContext.Provider>
    )
}

export function useInventoryContext() {
    const ctx = React.useContext(IventoryPanelContext);
    if (!ctx) throw new Error("useResearchDrawer must be used within ResearchDrawerProvider");
    return ctx;
}

function InventoryItemComponent({ item }: { item: InventoryItem }) {
    const {  consumeItem } = useClicker();
    return (
        <Box
            bg="rgba(255,255,255,0.25)"
            borderRadius="lg"
            boxShadow="md"
            display="flex"
            flexDirection="column"
            alignItems="center"
            cursor={"pointer"}
            justifyContent="center"
            aspectRatio={1}
            w="90px"
            h="90px"
            p={2}
            mb={2}
            onClick={() => {consumeItem(item.id)}}
        >
            <Text fontWeight="bold" fontSize="md" color="gray.900">{item.name}</Text>
            {item.type === "consumable" && <Text fontSize="sm" color="gray.600">x{item.amount}</Text>}
            {item.type === "equipment" && <Text fontSize="sm" color={item.owned ? "green.600" : "red.600"}>{item.owned ? "Equipped" : "Not Owned"}</Text>}
        </Box>
    );
}

export function InventoryPanel() {
    const { inventory } = useClicker();
    const { isOpen, close } = useInventoryContext();
    if (!isOpen) return null;
    return (
        <Box
            position="absolute"
            top={0}
            right={0}
            width="40%"
            height="100%"
            zIndex={1500}
            bg="rgba(255,255,255,0.18)"
            boxShadow="0 4px 32px 0 rgba(0,0,0,0.18)"
            backdropFilter="blur(16px)"
            borderRadius="2xl 0 0 2xl"
            border="1.5px solid rgba(255,255,255,0.25)"
            p={6}
            overflowY="auto"
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <Box w="100%" display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Text fontWeight="bold" fontSize="2xl" color="gray.900">Inventory</Text>
                <IconButton aria-label="Close Inventory" size="sm" onClick={close} variant="ghost"><FaX /></IconButton>
            </Box>
            <Grid templateColumns="repeat(3, 1fr)" gap={4} w="100%">
                {inventory.length === 0 && <Text color="gray.500" gridColumn={"1 / span 3"}>No items in inventory.</Text>}
                {inventory.map((item, i) => (
                    <InventoryItemComponent key={item.id + i} item={item} />
                ))}
            </Grid>
        </Box>
    );
}
