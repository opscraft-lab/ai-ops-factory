"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6">
            AI Ops <span className="text-blue-400">Factory</span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            KI-gestützte Betriebsanalyse für den deutschen Mittelstand.
            Prozesse optimieren. Kosten senken. Wachstum beschleunigen.
          </p>
          <div className="flex gap-6 justify-center">
            <Link
              href="/upload"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Analyse starten
            </Link>
            <Link
              href="/dashboard"
              className="border border-slate-500 hover:border-blue-400 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}