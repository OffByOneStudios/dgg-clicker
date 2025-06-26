import React from "react";
import { Background, BackgroundVariant, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Dagre from '@dagrejs/dagre';
import { ResearchCard,  } from './ResearchCard'; // Assuming CardNode is defined in CardNode.js
import { techTreeEdges, techTreeNodes } from "./techTree";

const nodeTypes = {
    research: ResearchCard,
};




const getLayoutedElements = (nodes: any[], edges: any[], options: any) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: options.direction });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) =>
        g.setNode(node.id, {
            ...node,
            width: node.measured?.width ?? 0,
            height: node.measured?.height ?? 0,
        }),
    );

    Dagre.layout(g);

    return {
        nodes: nodes.map((node) => {
            const position = g.node(node.id);
            
            const x = position.x - (node.measured?.width ?? 0) / 2;
            const y = position.y - (node.measured?.height ?? 0) / 2;

            return { ...node, position: { x, y } };
        }),
        edges,
    };
}


export function ResearchFlow() {
    const { fitView } = useReactFlow();
    const [measuredNodes, setMeasuredNodes] = React.useState(false);
    const [nodes, setNodes, onNodesChange] = useNodesState(techTreeNodes as any[]);
    const [edges, setEdges, onEdgesChange] = useEdgesState(techTreeEdges);

    const onLayout = React.useCallback(
        (direction: "TB" | "LR") => {
            const layouted = getLayoutedElements(nodes, edges, { direction });

            setNodes([...layouted.nodes]);
            setEdges([...layouted.edges]);

            fitView();
        },
        [nodes, edges],
    )

    React.useEffect(() => {
        // Check if all nodes have been measured
        if (measuredNodes) return;
        const allNodesMeasured = nodes.every(node =>
            //@ts-ignore
            node.measured?.width && node.measured?.height
        );

        if (allNodesMeasured && nodes.length > 0) {
            // Small delay to ensure DOM is updated
            const timer = setTimeout(() => {
                onLayout('TB');
                setMeasuredNodes(true)
            }, 10);

            return () => clearTimeout(timer);
        }
    }, [nodes]);



    return (
        <ReactFlow nodesDraggable={false} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
            {/* <Background color="#000000" variant={BackgroundVariant.Dots} /> */}
        </ReactFlow>
    )
}

