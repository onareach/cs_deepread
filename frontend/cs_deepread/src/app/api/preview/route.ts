// src/app/api/preview/route.ts
/* This is a Next.js API route using the new App Router (Next 13+) conventions. 
It's used to respond to GET requests made to the /api/preview endpoint of your application. */

import fs from "fs"; // Used to interact with the filesystem (reading files in this case).
import path from "path"; // Helps build platform-safe file paths.
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const relativePath = url.searchParams.get("path");

  if (!relativePath) {
    return new NextResponse("Missing path", { status: 400 });
  }
  
  //const filePath = path.join(process.cwd(), ...relativePath.split("/")); // used when folder/file tree expanded beyond src.
  const filePath = path.join(process.cwd(), "src", ...relativePath.split("/"));

  try {
    const fullText = fs.readFileSync(filePath, "utf-8");
    const snippet = fullText.split("\n").slice(0, 10).join("\n");
    return new NextResponse(snippet);
  } catch {
    return new NextResponse("Error reading file", { status: 500 });
  }
}
