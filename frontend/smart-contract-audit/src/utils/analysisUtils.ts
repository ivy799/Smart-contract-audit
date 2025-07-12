import { AnalysisResult, SeverityCounts, AnalysisStep } from "@/types/analysis";

export const getToday = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10);
};

export const getAnalysisStepText = (analysisStep: AnalysisStep) => {
  switch (analysisStep) {
    case "static":
      return "Performing static analysis...";
    case "llm":
      return "Running LLM contextual analysis...";
    case "recommendations":
      return "Generating recommendations...";
    case "complete":
      return "Analysis complete!";
    default:
      return "Analyzing...";
  }
};

export const getSeverityCounts = (analysisResult: AnalysisResult | null): SeverityCounts => {
  if (!analysisResult)
    return { high: 0, medium: 0, low: 0, informational: 0 };

  const counts = { high: 0, medium: 0, low: 0, informational: 0 };

  if (analysisResult.static_analysis_report?.issues) {
    analysisResult.static_analysis_report.issues.forEach((issue) => {
      const severity = issue.severity.toLowerCase();
      if (severity === "informational") counts.informational++;
      else if (severity === "low") counts.low++;
      else if (severity === "medium") counts.medium++;
      else if (severity === "high") counts.high++;
    });
  }

  if (analysisResult.llm_contextual_report?.findings) {
    analysisResult.llm_contextual_report.findings.forEach((finding) => {
      const severity = finding.severity.toLowerCase();
      if (severity === "tinggi" || severity === "high") counts.high++;
      else if (severity === "sedang" || severity === "medium")
        counts.medium++;
      else if (severity === "rendah" || severity === "low") counts.low++;
      else if (severity === "informational" || severity === "informasional")
        counts.informational++;
    });
  }

  return counts;
};

export const createChartData = (severityCounts: SeverityCounts) => {
  return [
    {
      severity: "High",
      count: severityCounts.high,
      fill: "hsl(var(--destructive))",
    },
    { severity: "Medium", count: severityCounts.medium, fill: "#f97316" },
    {
      severity: "Low",
      count: severityCounts.low,
      fill: "hsl(var(--secondary))",
    },
    {
      severity: "Informational",
      count: severityCounts.informational,
      fill: "hsl(var(--muted))",
    },
  ].filter((item) => item.count > 0);
};
