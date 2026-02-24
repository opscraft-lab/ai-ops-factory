"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, []);

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

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!userId || files.length === 0) return;
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(`Lade hoch: ${file.name} (${i + 1}/${files.length})`);

        // Upload to Supabase Storage
        const filePath = `${userId}/${Date.now()}_${file.name}`;
        const { error: storageError } = await supabase.storage
          .from("documents")
          .upload(filePath, file);

        if (storageError) throw storageError;

        // Save metadata to documents table
        const { error: dbError } = await supabase.from("documents").insert({
          user_id: userId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: filePath,
          status: "uploaded",
        });

        if (dbError) throw dbError;
      }

      setProgress("Alle Dateien erfolgreich hochgeladen!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      setProgress(`Fehler: ${error.message}`);
    } finally {
      setUploading(false);
    }
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
                  className="bg-slate-800 px-4 py-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <span>{file.name}</span>
                    <span className="text-slate-400 ml-3 text-sm">
                      {(file.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            {progress && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                progress.includes("Fehler") 
                  ? "bg-red-500/10 text-red-400" 
                  : progress.includes("erfolgreich")
                  ? "bg-green-500/10 text-green-400"
                  : "bg-blue-500/10 text-blue-400"
              }`}>
                {progress}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-6 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {uploading ? "Wird hochgeladen..." : "Hochladen & Analyse starten"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}