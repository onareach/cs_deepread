// src/components/ImageUpload.tsx
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadSuccess(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadSuccess(true);
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        console.error("Upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div
        {...getRootProps()}
        className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer overflow-hidden ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        ) : isDragActive ? (
          <p className="text-blue-600 font-medium">Drop the image here...</p>
        ) : (
          <p className="text-gray-500">Drag & drop an image, or click to select</p>
        )}
      </div>

      {uploadSuccess && (
        <p className="text-green-600 font-medium mt-4">✅ Upload successful!</p>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile}
        className={`mt-6 w-full py-2 rounded-lg text-white font-semibold transition-all ${
          selectedFile
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Upload & Parse
      </button>
    </div>
  );
}
