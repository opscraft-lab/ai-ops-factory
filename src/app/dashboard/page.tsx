"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-slate-700 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            AI Ops <span className="text-blue-400">Factory</span>
          </Link>
          <Link href="/upload" className="text-slate-300 hover:text-white">
            Upload
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Analysierte Dokumente</p>
            <p className="text-4xl font-bold mt-2">0</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Gefundene Optimierungen</p>
            <p className="text-4xl font-bold mt-2 text-green-400">0</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Geschätztes Einsparpotenzial</p>
            <p className="text-4xl font-bold mt-2 text-blue-400">€0</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400 text-lg mb-4">
            Noch keine Analysen vorhanden
          </p>
          <Link
            href="/upload"
            className="inline-block bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Erste Analyse starten
          </Link>
        </div>
      </div>
    </main>
  );
}