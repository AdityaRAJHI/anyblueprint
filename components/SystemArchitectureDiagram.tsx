import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface SystemArchitecture {
  components: string[];
  connections: string[];
  dataFlow?: string[];
}

interface SystemArchitectureDiagramProps {
  architecture: SystemArchitecture;
}

export default function SystemArchitectureDiagram({ architecture }: SystemArchitectureDiagramProps) {
  // Calculate layout dimensions
  const padding = 40;
  const boxWidth = 180;
  const boxHeight = 80;
  const svgWidth = 800;
  const svgHeight = Math.max(400, (Math.ceil(architecture.components.length / 3) * (boxHeight + 60)) + padding * 2);
  
  // Create a grid layout for components
  const getComponentPosition = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const totalCols = Math.min(3, architecture.components.length);
    const horizontalSpacing = (svgWidth - (totalCols * boxWidth)) / (totalCols + 1);
    
    return {
      x: horizontalSpacing + (col * (boxWidth + horizontalSpacing)),
      y: padding + (row * (boxHeight + 60))
    };
  };

  // Generate curved paths for connections
  const generatePath = (startIndex: number, endIndex: number) => {
    const start = getComponentPosition(startIndex);
    const end = getComponentPosition(endIndex);
    
    // Calculate control points for curved path
    const midY = (start.y + end.y) / 2;
    const controlPoint1 = { x: start.x + boxWidth / 2, y: midY };
    const controlPoint2 = { x: end.x + boxWidth / 2, y: midY };
    
    return `M ${start.x + boxWidth / 2} ${start.y + boxHeight}
            C ${controlPoint1.x} ${controlPoint1.y + 20},
              ${controlPoint2.x} ${controlPoint2.y + 20},
              ${end.x + boxWidth / 2} ${end.y}`;
  };

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <div className="bg-background rounded-lg">
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto"
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="currentColor"
                  className="text-muted-foreground"
                />
              </marker>
            </defs>

            {/* Draw connection lines first so they appear behind components */}
            {architecture.connections.map((_, index) => {
              const startIndex = index;
              const endIndex = (index + 1) % architecture.components.length;
              return (
                <g key={`connection-${index}`} className="text-muted-foreground">
                  <path
                    d={generatePath(startIndex, endIndex)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    markerEnd="url(#arrowhead)"
                    className="opacity-60"
                  />
                </g>
              );
            })}

            {/* Draw components */}
            {architecture.components.map((component, index) => {
              const pos = getComponentPosition(index);
              return (
                <g key={`component-${index}`}>
                  <rect
                    x={pos.x}
                    y={pos.y}
                    width={boxWidth}
                    height={boxHeight}
                    rx="4"
                    className="fill-card stroke-border"
                    strokeWidth="1.5"
                  />
                  <text
                    x={pos.x + boxWidth / 2}
                    y={pos.y + boxHeight / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-sm font-medium fill-foreground"
                  >
                    {component}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {Array.isArray(architecture.dataFlow) && architecture.dataFlow.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-semibold">Data Flow</h4>
            <ol className="list-decimal list-inside text-sm space-y-1">
              {architecture.dataFlow.map((flow, index) => (
                <li key={index} className="text-muted-foreground">{flow}</li>
              ))}
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
