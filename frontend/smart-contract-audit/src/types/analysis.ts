export interface AnalysisResult {
  metadata: {
    token_address?: string;
    file_path?: string;
  };
  static_analysis_report?: {
    tool_name: string;
    issues: Array<{
      check: string;
      severity: string;
      line: number;
      message: string;
    }>;
    error?: string;
  };
  llm_contextual_report?: {
    executive_summary: string;
    overall_risk_grading: string;
    risk_score?: number;
    findings: Array<{
      severity: string;
      category: string;
      description: string;
      confidence: number;
    }>;
    error?: string;
  };
  recommendations?: Array<{
    original_check: string;
    original_message: string;
    line_number: number;
    explanation: string;
    recommended_code_snippet: string;
  }>;
}

export type AnalysisStep = "idle" | "static" | "llm" | "recommendations" | "complete";

export interface SeverityCounts {
  high: number;
  medium: number;
  low: number;
  informational: number;
}
