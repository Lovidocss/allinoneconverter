// Re-export Lucide icons dynamically by name
import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iconsMap = Icons as unknown as Record<string, React.ComponentType<any>>;
  const IconComponent = iconsMap[name];
  if (!IconComponent) {
    return <Icons.File {...props} />;
  }
  return <IconComponent {...props} />;
}
