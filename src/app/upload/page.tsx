"use client";

import { useState } from "react";
import Link from "next/link";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    // TODO: Upload to Supabase Storage + trigger analysis
    setTimeout(() => {
      setUploading(false);
      alert("Upload erfolgreich! Analyse wird gestartet...");
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-slate-700 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            AI Ops <span className="text-blue-400">Factory</span>
          </Link>
          <Link href="/dashboard" className="text-slate-300 hover:text-white">
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Dokumente hochladen</h1>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-slate-600 hover:border-blue-400 rounded-xl p-12 text-center transition-colors cursor-pointer"
        >
          <div className="text-4xl mb-4">📄</div>
          <p className="text-lg text-slate-300 mb-2">
            Dateien hierher ziehen oder klicken
          </p>
          <p className="text-sm text-slate-500">
            PDF, Excel, CSV — Rechnungen, Berichte, Prozessdokumentation
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="mt-4 inline-block bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg cursor-pointer transition-colors"
          >
            Dateien auswählen
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              {files.length} Datei(en) ausgewählt
            </h2>
            <ul className="space-y-2">
              {files.map((file, i) => (
                <li
                  key={i}
                  className="bg-slate-800 px-4 py-3 rounded-lg flex justify-between"
                >
                  <span>{file.name}</span>
                  <span className="text-slate-400">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-6 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {uploading ? "Wird hochgeladen..." : "Analyse starten"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}