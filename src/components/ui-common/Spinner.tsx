import { Loader2 } from "lucide-react";

interface Props {
  size?: number;
  className?: string;
}

export function Spinner({ size = 14, className = "" }: Props) {
  return (
    <Loader2
      aria-hidden
      className={`animate-spin ${className}`}
      style={{ width: size, height: size }}
      strokeWidth={2}
    />
  );
}
