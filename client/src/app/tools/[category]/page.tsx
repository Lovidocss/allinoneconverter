import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getToolsByCategory } from "@/lib/tools-data";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { ToolCard } from "@/components/tool-card";
import type { ToolCategory } from "@/lib/tools-data";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) return {};
  return {
    title: `${cat.label} — Online PDF Tools`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();

  const catTools = getToolsByCategory(cat.slug as ToolCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <DynamicIcon name={cat.icon} className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{cat.label}</h1>
          <p className="text-muted-foreground mt-1">{cat.description}</p>
        </div>
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {catTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {catTools.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p>No tools in this category yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
