// src/components/FileTree.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export type TreeNode = {
  name: string;
  path: string; // e.g., "app/page.tsx"
  children?: TreeNode[];
};

type FileTreeProps = {
  tree: TreeNode[];
};

export default function FileTree({ tree }: FileTreeProps) {
  return (
    <div className="font-mono text-sm pl-2">
      {tree.map((node) => (
        <TreeNodeItem key={node.path} node={node} />
      ))}
    </div>
  );
}

function TreeNodeItem({ node, level = 0 }: { node: TreeNode; level?: number }) {
  const [expanded, setExpanded] = useState(true);
  const isFolder = !!node.children;
  const indent = { paddingLeft: `${level * 1.25}rem` };

  return (
    <div style={indent} className="mb-1">
      {isFolder ? (
        <>
          <div
            className="cursor-pointer text-gray-800 font-semibold"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "📂" : "📁"} {node.name}
          </div>
          {expanded &&
            node.children?.map((child) => (
              <TreeNodeItem key={child.path} node={child} level={level + 1} />
            ))}
        </>
      ) : (
        <Link
          href={`/settings/code-awareness/${node.path}`}
          className="text-blue-600 hover:underline"
        >
          📄 {node.name}
        </Link>
      )}
    </div>
  );
}
