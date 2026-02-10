"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  FileText,
  Lock,
  CloudOff,
  Search,
  Layers,
  FileInput,
  FileOutput,
  PenTool,
  Crop,
  MoreHorizontal,
  Puzzle,
} from "lucide-react";
import { categories, tools, getToolsByCategory } from "@/lib/tools-data";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { ToolCard } from "@/components/tool-card";
import NeuralBackground from "@/components/ui/flow-field-background";

const heroCategories = [
  { slug: "all", label: "All", icon: Layers },
  { slug: "convert-to-pdf", label: "Convert to PDF", icon: FileInput },
  { slug: "convert-from-pdf", label: "Convert PDF to", icon: FileOutput },
  { slug: "edit", label: "Edit PDFs", icon: PenTool },
  { slug: "organize", label: "Organize", icon: Crop },
  { slug: "optimize", label: "More PDFs", icon: MoreHorizontal },
  { slug: "business", label: "Addons", icon: Puzzle },
];

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools =
    activeFilter === "all"
      ? tools
      : tools.filter((t) => t.category === activeFilter);

  const displayTools = searchQuery
    ? filteredTools.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredTools;

  return (
    <>
      {/* ─── Full-page Neural Flow Field Background ─── */}
      <div className="fixed inset-0 -z-10">
        <NeuralBackground
          color="#818cf8"
          trailOpacity={0.1}
          speed={0.8}
          particleCount={600}
        />
      </div>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white">
            <span className="italic">Unleash </span>
            <span className="bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
              PDF Superpowers
            </span>
            <br />
            <span>Edit, Convert & Create </span>
            <span className="text-red-400">Like a Pro</span>
          </h1>
        </div>
      </section>

      {/* ─── Search & Filter Section ─── */}
      <section className="relative -mt-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Search bar */}
          <div className="bg-white/90 dark:bg-card/90 backdrop-blur-sm rounded-2xl shadow-xl border border-border p-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors">
              <Search className="w-5 h-5 sm:hidden" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {/* Category filter tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {heroCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveFilter(cat.slug)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeFilter === cat.slug
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-white/80 dark:bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-foreground border border-border hover:border-foreground/20"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Tools Grid ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Edit, Organize, Merge, Compress PDFs & More.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Convert images between various formats with our quick and easy
            tools. No installation needed!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayTools.slice(0, 20).map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>

        {displayTools.length > 20 && (
          <div className="mt-8 text-center">
            <Link
              href="#all-tools"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              View All {displayTools.length} Tools
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* ─── All Categories ─── */}
      <section
        id="all-tools"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">All PDF Tools</h2>
          <p className="mt-3 text-muted-foreground">
            Browse 100+ tools organized by category
          </p>
        </div>

        <div className="space-y-16">
          {categories.map((cat) => {
            const catTools = getToolsByCategory(cat.slug);
            return (
              <div key={cat.slug}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <DynamicIcon
                        name={cat.icon}
                        className="w-5 h-5 text-primary"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{cat.label}</h3>
                      <p className="text-sm text-muted-foreground">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/tools/${cat.slug}`}
                    className="text-sm text-primary font-medium hover:underline hidden sm:block"
                  >
                    View all →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {catTools.slice(0, 8).map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
                {catTools.length > 8 && (
                  <div className="mt-4 text-center sm:hidden">
                    <Link
                      href={`/tools/${cat.slug}`}
                      className="text-sm text-primary font-medium"
                    >
                      View all {catTools.length} tools →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="bg-muted/30 backdrop-blur-sm border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why 🫶iDocs?</h2>
            <p className="mt-3 text-muted-foreground">
              Built for speed, privacy, and simplicity
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Process files instantly with cutting-edge browser technology",
              },
              {
                icon: Lock,
                title: "100% Secure",
                desc: "Files are processed locally and auto-deleted immediately",
              },
              {
                icon: CloudOff,
                title: "No Installation",
                desc: "Works in your browser — no software to download",
              },
              {
                icon: FileText,
                title: "100+ Tools",
                desc: "Every PDF tool you&apos;ll ever need in a single platform",
              },
            ].map((feat) => (
              <div
                key={feat.title}
                className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="bg-foreground rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-background">Ready to Get Started?</h2>
          <p className="mt-4 text-background/70 max-w-lg mx-auto">
            Join over 1 million users who trust 🫶iDocs for their daily
            document needs. Upgrade to Premium for unlimited access.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="px-8 py-3.5 bg-background text-foreground font-medium rounded-xl hover:opacity-90 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3.5 border-2 border-background/30 text-background font-medium rounded-xl hover:bg-background/10 transition-colors"
            >
              See Plans
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
