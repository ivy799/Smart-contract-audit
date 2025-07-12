import { ChartConfig } from "@/components/ui/chart";

export const chartConfig = {
  count: {
    label: "Issues",
  },
  High: {
    label: "High",
    color: "hsl(var(--destructive))",
  },
  Medium: {
    label: "Medium",
    color: "#f97316",
  },
  Low: {
    label: "Low",
    color: "hsl(var(--secondary))",
  },
  Informational: {
    label: "Informational",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig;
