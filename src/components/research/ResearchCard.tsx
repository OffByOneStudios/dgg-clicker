import React from "react";
import { Box, Text, Image } from "@chakra-ui/react";
import { Handle, Position } from "@xyflow/react";

enum HandleType {
    Source = "source",
    Target = "target",
    Both = "both"
}

export interface ResearchCardProps {
    title: string;
    description: string;
    image: string;
    handleType?: HandleType;
}

export interface ResearchNodeProps {
    id: string;
    type: string;
    position: { x: number, y: number }
    data: ResearchCardProps;
}


export function ResearchCard({data}: {data: ResearchCardProps}) {
    const { title, description, image, handleType } = data;
    const handle = handleType || HandleType.Both; // Default to both handles
    return (
        <Box
            bg="rgba(255,255,255,0.15)"
            boxShadow="0 4px 32px 0 rgba(0,0,0,0.15)"
            backdropFilter="blur(12px)"
            borderRadius="xl"
            border="1px solid rgba(255,255,255,0.25)"
            p={4}
            
            w="250px"
            h="350px"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            transition="box-shadow 0.2s"
            _hover={{ boxShadow: "0 8px 40px 0 rgba(0,0,0,0.25)" }}
        >
            <Image
                src={image}
                alt={title}
                borderRadius="lg"
                boxSize="200px"
                objectFit="cover"
                mb={3}
                bg="rgba(255,255,255,0.25)"
            />
            <Text fontWeight="bold" fontSize="lg" color="gray.900" mb={1} textAlign="center">
                {title}
            </Text>
            <Text fontSize="sm" color="gray.700" textAlign="center">
                {description}
            </Text>
            <Handle type="source" position={Position.Top} />
            <Handle type="target" position={Position.Bottom} />
        </Box>
    );
}

// export const RootResearchCard = ({data}: ResearchCardProps) => (
//     <ResearchCard
//         {...props}
//     />
// );

// export const CapstoneResearchCard = (props: ResearchCardProps) => (
//     <ResearchCard
//         {...props}
//     />
// );