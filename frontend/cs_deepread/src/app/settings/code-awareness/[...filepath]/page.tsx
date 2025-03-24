import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

type Props = {
  params: {
    filepath: string[];
  };
};

export default function FileViewer({ params }: Props) {
  const filePathArray = Array.isArray(params.filepath)
    ? params.filepath
    : [params.filepath];

  const relativePath = filePathArray.join("/");
  const fullPath = path.join(process.cwd(), "src", ...filePathArray);

  // Check if the file exists
  if (!fs.existsSync(fullPath)) {
    throw notFound(); // ✅ Correct usage
  }

  // Read file contents
  const code = fs.readFileSync(fullPath, "utf-8");

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-xl font-bold mb-4">📄 {relativePath}</h1>
      <textarea
        value={code}
        readOnly
        className="w-full h-[600px] font-mono text-sm p-4 border border-gray-300 rounded-md bg-gray-50"
      />
    </div>
  );
}
