// src/app/api/preview/route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const relativePath = url.searchParams.get("path");

  if (!relativePath) {
    return new NextResponse("Missing path", { status: 400 });
  }
  
  const filePath = path.join(process.cwd(), ...relativePath.split("/"));
  // const filePath = path.join(process.cwd(), "src", ...relativePath.split("/")); // old file path const

  try {
    const fullText = fs.readFileSync(filePath, "utf-8");
    const snippet = fullText.split("\n").slice(0, 10).join("\n");
    return new NextResponse(snippet);
  } catch {
    return new NextResponse("Error reading file", { status: 500 });
  }
}
