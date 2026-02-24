"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-x-hidden" style={{ fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
     <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        @keyframes pulse-glow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in-up 0.8s ease forwards; }
        .animate-d1 { animation: fade-in-up 0.8s ease 0.1s forwards; opacity: 0; }
        .animate-d2 { animation: fade-in-up 0.8s ease 0.2s forwards; opacity: 0; }
        .animate-d3 { animation: fade-in-up 0.8s ease 0.3s forwards; opacity: 0; }
        .animate-d4 { animation: fade-in-up 0.8s ease 0.4s forwards; opacity: 0; }
        .glow-pulse { animation: pulse-glow 3s ease-in-out infinite; }
      `}} />

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0a0e1a]/90 backdrop-blur-xl border-b border-white/5 py-3" : "py-5"}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">Ai</div>
            <span className="text-lg font-bold tracking-tight">AI Ops Factory</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">So funktioniert&apos;s</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">Anmelden</Link>
            <Link href="/login" className="text-sm bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:-translate-y-0.5">Kostenlos testen</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] glow-pulse" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] glow-pulse" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-xs text-gray-300 font-medium">Jetzt verfügbar für DACH-Unternehmen</span>
            </div>
            <h1 className="animate-d1 text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
              Finden Sie die<br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">versteckten Kosten</span><br />
              in Ihrem Unternehmen
            </h1>
            <p className="animate-d2 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              KI-gestützte Betriebsanalyse für den deutschen Mittelstand. Wir scannen Ihre SaaS-Tools, Prozesse und IT-Kosten — und zeigen Ihnen wo Sie <strong className="text-white">bis zu 20% einsparen</strong> können.
            </p>
            <div className="animate-d3 flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/login" className="group bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-blue-500/25 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                Kostenlose Analyse starten
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <a href="#how-it-works" className="border border-white/10 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                So funktioniert&apos;s
              </a>
            </div>
            <div className="animate-d4 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              {[{ value: "20%", label: "Ø Einsparung" }, { value: "<48h", label: "Bis zum Ergebnis" }, { value: "€0", label: "Erste Analyse" }].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-1 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-red-500/5 to-red-900/10 border border-red-500/10 rounded-3xl p-8 md:p-10">
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-red-300">Das Problem</h3>
              <p className="text-gray-400 leading-relaxed mb-6">Deutsche Mittelständler geben durchschnittlich <strong className="text-white">€280.000/Jahr</strong> für SaaS-Tools und IT-Prozesse aus — und verschwenden davon bis zu 25%.</p>
              <div className="space-y-3">
                {["Lizenzen die niemand nutzt", "Doppelte Tools für den gleichen Zweck", "Stundenlange manuelle Prozesse", "Intransparente Kosten"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />{item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/5 to-green-900/10 border border-green-500/10 rounded-3xl p-8 md:p-10">
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-green-300">Die Lösung</h3>
              <p className="text-gray-400 leading-relaxed mb-6">AI Ops Factory scannt Ihre komplette IT-Landschaft mit KI und liefert einen <strong className="text-white">konkreten Aktionsplan</strong> mit Einsparungen.</p>
              <div className="space-y-3">
                {["Volle Transparenz über alle SaaS-Kosten", "Konkrete Einsparungen pro Tool", "Priorisierter Maßnahmenkatalog", "ROI innerhalb von 4 Wochen"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0" />{item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-xs text-blue-300 font-semibold uppercase tracking-wider">Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Alles was Sie brauchen</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Von der Analyse bis zum konkreten Aktionsplan — in einer Plattform.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "📤", title: "Dokument-Upload", desc: "Laden Sie SaaS-Rechnungen, Lizenzübersichten und Prozessdokumente hoch. Excel, CSV und PDF.", color: "from-blue-500/10 to-blue-500/5 border-blue-500/10" },
              { icon: "🤖", title: "KI-Analyse", desc: "Unsere KI erkennt ungenutzte Lizenzen, doppelte Tools, überteuerte Verträge und manuelle Prozesse.", color: "from-cyan-500/10 to-cyan-500/5 border-cyan-500/10" },
              { icon: "📊", title: "Ops Health Dashboard", desc: "Ihr Dashboard zeigt den Gesundheitszustand Ihrer IT-Ops mit Score, Benchmarks und Trends.", color: "from-green-500/10 to-green-500/5 border-green-500/10" },
              { icon: "💰", title: "Savings Map", desc: "Sehen Sie auf einen Blick wo Ihr Geld hinfließt und wo die größten Einsparpotenziale liegen.", color: "from-yellow-500/10 to-yellow-500/5 border-yellow-500/10" },
              { icon: "✅", title: "Aktionsplan", desc: "Priorisierte Maßnahmen sortiert nach Impact und Aufwand. Quick Wins zuerst.", color: "from-purple-500/10 to-purple-500/5 border-purple-500/10" },
              { icon: "📄", title: "PDF Reports", desc: "Professionelle Berichte für Ihre Geschäftsführung mit konkreten Zahlen und Empfehlungen.", color: "from-orange-500/10 to-orange-500/5 border-orange-500/10" },
            ].map((f) => (
              <div key={f.title} className={`bg-gradient-to-br ${f.color} border rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300`}>
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/3 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-xs text-cyan-300 font-semibold uppercase tracking-wider">3 Schritte</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">So einfach geht&apos;s</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Von der ersten Datei bis zum fertigen Einsparbericht in unter 48 Stunden.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Daten hochladen", desc: "Laden Sie SaaS-Rechnungen, Lizenzlisten und Prozessdokumente hoch. Excel, CSV oder PDF.", color: "from-blue-500 to-blue-600" },
              { step: "02", title: "KI analysiert", desc: "Unsere KI scannt jedes Dokument, erkennt Muster, vergleicht mit Benchmarks und identifiziert Einsparpotenziale.", color: "from-cyan-500 to-cyan-600" },
              { step: "03", title: "Ergebnisse erhalten", desc: "Interaktives Dashboard mit Ops Health Score, konkreten Einsparungen und einem Aktionsplan.", color: "from-green-500 to-green-600" },
            ].map((item) => (
              <div key={item.step} className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white font-extrabold text-lg mb-6 shadow-lg`}>{item.step}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-gradient-to-r from-white/[0.03] to-white/[0.01] border border-white/5 rounded-3xl p-10 md:p-14 text-center">
            <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold mb-8">Gebaut für den deutschen Mittelstand</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[{ value: "10-100", label: "Mitarbeiter Zielgruppe" }, { value: "DSGVO", label: "Konform · EU-Server" }, { value: "47+", label: "SaaS-Tools erkannt" }, { value: "20.5%", label: "Ø Einsparpotenzial" }].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl md:text-3xl font-extrabold text-white mb-1">{s.value}</div>
                  <div className="text-xs text-gray-500 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-xs text-green-300 font-semibold uppercase tracking-wider">Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Transparent &amp; fair</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Starten Sie kostenlos. Zahlen Sie nur wenn Sie Ergebnisse sehen.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all">
              <div className="text-sm font-semibold text-gray-400 mb-2">Free Scan</div>
              <div className="flex items-baseline gap-1 mb-4"><span className="text-4xl font-extrabold">€0</span></div>
              <p className="text-sm text-gray-500 mb-8">Erste Analyse kostenlos — sehen Sie was möglich ist.</p>
              <Link href="/login" className="block w-full text-center py-3 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/5 transition-all mb-8">Kostenlos starten</Link>
              <div className="space-y-3">
                {["1 Analyse", "Ops Health Score", "Top 5 Quick Wins", "Export als PDF"].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-gray-400">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{f}
                  </div>
                ))}
              </div>
            </div>
            {/* Pro */}
            <div className="relative bg-gradient-to-b from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-3xl p-8 scale-[1.03]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-bold px-4 py-1 rounded-full">BELIEBT</div>
              <div className="text-sm font-semibold text-blue-300 mb-2">Pro</div>
              <div className="flex items-baseline gap-1 mb-4"><span className="text-4xl font-extrabold">€299</span><span className="text-gray-500 text-sm">/Monat</span></div>
              <p className="text-sm text-gray-500 mb-8">Für Unternehmen die kontinuierlich optimieren wollen.</p>
              <Link href="/login" className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all mb-8">Jetzt starten</Link>
              <div className="space-y-3">
                {["Unbegrenzte Analysen", "Vollständiges Dashboard", "Aktionsplan mit Timeline", "Monatliche Reports", "E-Mail Support"].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-gray-400">
                    <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{f}
                  </div>
                ))}
              </div>
            </div>
            {/* Enterprise */}
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all">
              <div className="text-sm font-semibold text-gray-400 mb-2">Enterprise</div>
              <div className="flex items-baseline gap-1 mb-4"><span className="text-4xl font-extrabold">Individuell</span></div>
              <p className="text-sm text-gray-500 mb-8">Maßgeschneiderte Lösung für größere Unternehmen.</p>
              <a href="mailto:hello@ai-ops-factory.de" className="block w-full text-center py-3 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/5 transition-all mb-8">Kontakt aufnehmen</a>
              <div className="space-y-3">
                {["Alles aus Pro", "Multi-Standort Analyse", "API-Zugang", "Dedizierter Ansprechpartner", "Custom Integrationen"].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-gray-400">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border border-blue-500/20 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Bereit Kosten zu senken?</h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">Starten Sie jetzt Ihre kostenlose Analyse und sehen Sie in unter 48 Stunden wo Ihr Einsparpotenzial liegt.</p>
              <Link href="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-blue-500/25 transition-all hover:-translate-y-1">
                Kostenlose Analyse starten
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-xs">Ai</div>
              <span className="text-sm font-semibold">AI Ops Factory</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>DSGVO-konform</span>
              <span>·</span>
              <span>EU-Server (Frankfurt)</span>
              <span>·</span>
              <span>Made in Germany</span>
            </div>
            <div className="text-sm text-gray-600">© 2026 AI Ops Factory. Alle Rechte vorbehalten.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}