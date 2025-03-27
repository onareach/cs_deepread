// src/app/settings/page.tsx

import fs from "fs";
import path from "path";
import FileTree, { TreeNode } from "../../components/FileTree";

function getAllFiles(dir: string, basePath = ""): string[] {
  return fs.readdirSync(dir).flatMap((entry) => {
    const fullPath = path.join(dir, entry);
    const relativePath = path.join(basePath, entry);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      return getAllFiles(fullPath, relativePath);
    } else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
      // 🧼 Filter out the dynamic route file itself
      const isDynamicRoutePage =
        relativePath.includes("[...filepath]") && entry === "page.tsx";
      return isDynamicRoutePage ? [] : [relativePath];
    } else {
      return [];
    }
  });
}

function buildFileTree(paths: string[]): any {
  const tree: any = {};
  for (const filePath of paths) {
    const parts = filePath.split("/");
    let current = tree;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        current[part] = true;
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    }
  }
  return tree;
}

function convertToNodeArray(obj: any, parentPath = ""): TreeNode[] {
  return Object.entries(obj).map(([name, value]) => {
    const fullPath = parentPath ? `${parentPath}/${name}` : name;

    if (value === true) {
      return { name, path: fullPath };
    } else {
      return {
        name,
        path: fullPath,
        children: convertToNodeArray(value, fullPath),
      };
    }
  });
}

export default function SettingsPage() {
  //const sourceDir = process.cwd(); // Use this line if you want file tree to expand above src/
  const sourceDir = path.join(process.cwd(), "src");
  const files = getAllFiles(sourceDir);
  const fileTree = buildFileTree(files);
  const treeNodes = convertToNodeArray(fileTree);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">⚙️ Settings</h2>
        <section>
          <h3 className="text-xl font-semibold mb-1">Current Code</h3>

            <div className="text-gray-800 font-semibold mb-2">
              📁 {`${path.basename(process.cwd())}/src`}
            </div>

          <FileTree tree={treeNodes} />
        </section>
    </div>
  );
}
