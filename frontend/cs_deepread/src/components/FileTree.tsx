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
  /* Create a boolen value called "expanded", that updated with the function setExpanded, and which has
  a beginning value of True. */
  const [expanded, setExpanded] = useState(true);
  /* If a node has children, it's a folder — otherwise, it's a file. (The double exclamation marks (!!)
  have the effect of reading the value node.children as a boolean - if children, then this constant's
  value is true and the node is a folder; if the node doesn't have children, then the value is false 
  and the node is a file. */
  const isFolder = !!node.children;
  /* Create a style object appropriately called "indent", which is the amount of left padding the node
  has based on it’s level in the tree. The deeper the node is in the tree, the larger the indent is. 
  For every level down in the tree, the indent value is 1.25 times the rem (Root EleMent font size. */
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
