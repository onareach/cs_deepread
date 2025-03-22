// src/app/upload/page.tsx

"use client";

import ImageUpload from "../../components/ImageUpload";

export default function UploadPage() {
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload an Image</h2>
      <ImageUpload />
    </div>
  );
}
