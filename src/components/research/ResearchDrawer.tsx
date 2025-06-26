import React from "react";
import {

    Portal,
} from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { FaX } from "react-icons/fa6";

import {ResearchFlow} from './ResearchFlow';
import { ReactFlowProvider } from "@xyflow/react";
import { useResearchDrawer } from "./ResearchDrawerContext";

export function ResearchDrawer() {
    const { isOpen, close } = useResearchDrawer();
    if (!isOpen) return null;
    return (
        <Portal>
            <Box
                data-state={isOpen ? "open" : "closed"}
                _open={{
                    animation: "fade-in 300ms ease-out",
                }}
                _closed={{
                    animation: "fadeOut 300ms ease-in",
                }}
                bgImage={`url('/img/bg/forest.jpg')`}
                position="fixed"
                top={0}
                left={0}
                w="100vw"
                h="100vh"
                zIndex={"overlay"}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Box position="absolute" zIndex={"modal"} top={6} right={8}>
                    <FaX
                        size={24}
                        cursor="pointer"
                        color="black"

                        onClick={close}
                    />
                </Box>
                <ReactFlowProvider>
                    <ResearchFlow />
                </ReactFlowProvider>
            </Box>
        </Portal>
    );
}
