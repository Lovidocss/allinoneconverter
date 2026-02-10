import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import type { Tool } from "@/lib/tools-data";

interface ToolCardProps {
  tool: Tool;
  badge?: "new" | "hot";
}

// Some tools get badges
const toolBadges: Record<string, "new" | "hot"> = {
  "analyze-pdf": "new",
  "compress-pdf": "hot",
  "merge-pdf": "hot",
  "listen-pdf": "new",
  "scan-pdf": "new",
};

export function ToolCard({ tool, badge }: ToolCardProps) {
  const actualBadge = badge || toolBadges[tool.slug];

  // Split tool name to show first word in different style
  const nameParts = tool.name.split(" ");
  const firstWord = nameParts[0];
  const restWords = nameParts.slice(1).join(" ");

  return (
    <Link href={`/tool/${tool.slug}`} className="group block">
      <div className="bg-white dark:bg-card border border-border rounded-2xl p-5 h-full flex flex-col hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all relative">
        {/* Badge */}
        {actualBadge && (
          <span
            className={`absolute top-3 right-3 px-2 py-0.5 text-xs font-medium rounded-full ${
              actualBadge === "new"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                : "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400"
            }`}
          >
            {actualBadge === "new" ? "● New" : "● Hot"}
          </span>
        )}

        {/* Dashed circle icon */}
        <div className="w-14 h-14 rounded-full border-2 border-dashed border-blue-400 flex items-center justify-center mb-4 group-hover:border-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 transition-all">
          <DynamicIcon name={tool.icon} className="w-6 h-6 text-blue-500" />
        </div>

        {/* Tool name with split styling */}
        <h3 className="font-semibold text-base mb-1.5">
          <span className="text-red-500">{firstWord}</span>
          {restWords && <span className="text-foreground"> {restWords}</span>}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {tool.description}
        </p>

        {/* Open Me link */}
        <div className="flex items-center gap-1 text-sm font-medium text-blue-500 group-hover:text-blue-600 transition-colors">
          Open Me
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
