"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircleIcon,
  InfoIcon,
  AlertTriangleIcon,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Background from "../components/Background";

interface AnalysisResult {
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

export default function Home() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [selectedOption, setSelectedOption] = useState<string>("Token");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [usageCount, setUsageCount] = useState<number>(0);
  const [maxUsage] = useState<number>(5);
  const [lastReset, setLastReset] = useState<string>("");
  const [analysisStep, setAnalysisStep] = useState<
    "idle" | "static" | "llm" | "recommendations" | "complete"
  >("idle");
  const [staticAnalysisResult, setStaticAnalysisResult] = useState<any>(null);
  const [llmAnalysisResult, setLlmAnalysisResult] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();

  const getToday = () => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  };

  useEffect(() => {
    if (isSignedIn && user) {
      const storageKey = `analysis_usage_${user.id}`;
      const dateKey = `analysis_usage_date_${user.id}`;
      const storedCount = localStorage.getItem(storageKey);
      const storedDate = localStorage.getItem(dateKey);
      const today = getToday();

      if (storedDate !== today) {
        localStorage.setItem(storageKey, "0");
        localStorage.setItem(dateKey, today);
        setUsageCount(0);
        setLastReset(today);
      } else {
        setUsageCount(storedCount ? parseInt(storedCount) : 0);
        setLastReset(storedDate || today);
      }
    }
  }, [isSignedIn, user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith(".sol")) {
      setSelectedFile(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a .sol file",
        variant: "destructive",
      });
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    return response.json();
  };

  const getContractFromAddress = async (address: string) => {
    const response = await fetch(
      "http://localhost:8000/contract-from-address",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch contract from address");
    }

    return response.json();
  };

  const performStaticAnalysis = async (contractData: any) => {
    const response = await fetch("http://localhost:8001/static-analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contractData),
    });

    if (!response.ok) {
      throw new Error("Failed to perform static analysis");
    }

    return response.json();
  };

  const performLlmAnalysis = async (contractData: any) => {
    const response = await fetch("http://localhost:8001/llm-analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contractData),
    });

    if (!response.ok) {
      throw new Error("Failed to perform LLM analysis");
    }

    return response.json();
  };

  const generateRecommendations = async (staticAnalysisData: any) => {
    const response = await fetch(
      "http://localhost:8001/generate-recommendations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(staticAnalysisData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate recommendations");
    }

    return response.json();
  };

  const handleAnalyze = async () => {
    if (!isSignedIn || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to analyze contracts",
        variant: "destructive",
      });
      return;
    }

    if (usageCount >= maxUsage) {
      toast({
        title: "Usage limit reached",
        description: `You have reached the maximum limit of ${maxUsage} analyses for today. Please come back tomorrow or upgrade your plan for unlimited access.`,
        variant: "destructive",
      });
      return;
    }

    if (selectedOption === "Token" && !tokenAddress.trim()) {
      toast({
        title: "Token address required",
        description: "Please enter a token address",
        variant: "destructive",
      });
      return;
    }

    if (selectedOption === "Upload" && !selectedFile) {
      toast({
        title: "File required",
        description: "Please select a .sol file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisStep("idle");

    try {
      let contractData;

      if (selectedOption === "Token") {
        contractData = await getContractFromAddress(tokenAddress);
      } else {
        contractData = await uploadFile(selectedFile!);
      }

      setAnalysisStep("static");
      const staticResult = await performStaticAnalysis(contractData);
      setStaticAnalysisResult(staticResult);

      setAnalysisStep("llm");
      const llmResult = await performLlmAnalysis(contractData);
      setLlmAnalysisResult(llmResult);

      setAnalysisStep("recommendations");
      const recommendationsResult = await generateRecommendations(staticResult);

      const combinedResult: AnalysisResult = {
        metadata: contractData.metadata || {
          token_address: selectedOption === "Token" ? tokenAddress : undefined,
          file_path:
            selectedOption === "Upload" ? selectedFile?.name : undefined,
        },
        static_analysis_report: staticResult,
        llm_contextual_report: llmResult,
        recommendations: recommendationsResult.recommendations || [],
      };

      setAnalysisResult(combinedResult);
      setAnalysisStep("complete");

      const newUsageCount = usageCount + 1;
      setUsageCount(newUsageCount);
      const storageKey = `analysis_usage_${user.id}`;
      const dateKey = `analysis_usage_date_${user.id}`;
      const today = getToday();
      localStorage.setItem(storageKey, newUsageCount.toString());
      localStorage.setItem(dateKey, today);

      toast({
        title: "Analysis completed",
        description: `Smart contract analysis has been completed successfully. ${
          maxUsage - newUsageCount
        } analyses remaining for today.`,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during analysis",
        variant: "destructive",
      });
      setAnalysisStep("idle");
    } finally {
      setIsLoading(false);
    }
  };

  const getAnalysisStepText = () => {
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

  const getSeverityCounts = () => {
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

  const severityCounts = getSeverityCounts();
  const chartData = [
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

  const chartConfig = {
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

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "tinggi":
      case "high":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircleIcon className="w-3 h-3" />
            {severity}
          </Badge>
        );
      case "sedang":
      case "medium":
        return (
          <Badge className="bg-orange-500 text-white flex items-center gap-1">
            <AlertTriangleIcon className="w-3 h-3" />
            {severity}
          </Badge>
        );
      case "rendah":
      case "low":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <InfoIcon className="w-3 h-3" />
            {severity}
          </Badge>
        );
      case "informational":
      case "informasional":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <InfoIcon className="w-3 h-3" />
            {severity}
          </Badge>
        );
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden font-[family-name:var(--font-geist-sans)]">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden font-[family-name:var(--font-geist-sans)]">
        <Background />

        <Footer />

        <div className="flex items-center justify-center min-h-screen relative z-20">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                Authentication Required
              </CardTitle>
              <CardDescription>
                You need to sign in to access the smart contract analyzer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SignInButton>
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
                  Sign In to Continue
                </Button>
              </SignInButton>
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <SignUpButton>
                  <button className="text-yellow-400 hover:underline">
                    Sign up here
                  </button>
                </SignUpButton>
              </div>
            </CardContent>
          </Card>
        </div>

        <footer className="flex gap-6 flex-wrap items-center justify-center text-sm relative z-20 py-4 mt-auto flex-shrink-0">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
            href="#"
          >
            Learn
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
            href="#"
          >
            Examples
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
            href="#"
          >
            Term and Conditions
          </a>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden font-[family-name:var(--font-geist-sans)]">
      <Background />
      <Navbar />

      <div className="w-full max-w-6xl mx-auto px-4 py-8 mt-20 relative z-20">
        <div className="grid gap-8 md:grid-cols-2">
          <Card id="input-section" className="w-full relative z-30">
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>
                Enter your smart contract ({maxUsage - usageCount} analyses
                remaining for today)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="w-full">
                  <Select
                    value={selectedOption}
                    onValueChange={setSelectedOption}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Options</SelectLabel>
                        <SelectItem value="Token">Token</SelectItem>
                        <SelectItem value="Upload">Upload</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {selectedOption === "Token" && (
                    <div className="grid w-full items-center gap-3 mt-4">
                      <Label htmlFor="token">Token Address</Label>
                      <Input
                        id="token"
                        type="text"
                        placeholder="0x..."
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  )}
                  {selectedOption === "Upload" && (
                    <div className="grid w-full items-center gap-3 mt-4">
                      <Label>Upload Solidity File</Label>
                      <Input
                        id="solidityFile"
                        type="file"
                        accept=".sol"
                        onChange={handleFileChange}
                        disabled={isLoading}
                      />
                      {selectedFile && (
                        <p className="text-sm text-muted-foreground">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button
                onClick={handleAnalyze}
                disabled={isLoading || usageCount >= maxUsage}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {getAnalysisStepText()}
                  </>
                ) : usageCount >= maxUsage ? (
                  "Usage Limit Reached"
                ) : (
                  "Analyze Contract"
                )}
              </Button>
              {usageCount >= maxUsage && (
                <p className="text-sm text-muted-foreground text-center">
                  You've reached your daily analysis limit. It will reset
                  tomorrow.
                </p>
              )}
              {isLoading && (
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{
                      width:
                        analysisStep === "static"
                          ? "33%"
                          : analysisStep === "llm"
                          ? "66%"
                          : analysisStep === "recommendations"
                          ? "90%"
                          : analysisStep === "complete"
                          ? "100%"
                          : "10%",
                    }}
                  />
                </div>
              )}
            </CardFooter>
          </Card>

          <Card className="flex flex-col relative z-30">
            <CardHeader className="items-center pb-0">
              <CardTitle>Security Issues Distribution</CardTitle>
              <CardDescription>Analysis Results by Severity</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              {analysisResult && chartData.length > 0 ? (
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={chartData}
                      dataKey="count"
                      nameKey="severity"
                      stroke="0"
                    />
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  {isLoading ? "Analyzing..." : "No analysis data available"}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 leading-none font-medium">
                Total Issues Found:{" "}
                {chartData.reduce((sum, item) => sum + item.count, 0)}{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground leading-none">
                {analysisResult
                  ? "Security analysis completed"
                  : "Waiting for analysis"}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {analysisResult && (
        <section
          id="result"
          className="w-full max-w-6xl mx-auto px-4 py-8 relative z-20"
        >
          <Card className="w-full relative z-30">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Analysis Results</CardTitle>
                  <CardDescription>
                    Smart contract security analysis for{" "}
                    {analysisResult.metadata.token_address
                      ? `token: ${analysisResult.metadata.token_address}`
                      : `file: ${analysisResult.metadata.file_path}`}
                  </CardDescription>
                </div>
                {analysisResult.llm_contextual_report?.overall_risk_grading && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Overall Risk:</span>
                    {getSeverityBadge(
                      analysisResult.llm_contextual_report.overall_risk_grading
                    )}
                    {analysisResult.llm_contextual_report.risk_score && (
                      <span className="text-sm text-muted-foreground">
                        ({analysisResult.llm_contextual_report.risk_score}/100)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-3">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Static Analysis Issues
                  </h3>
                  <ScrollArea className="h-80 w-full rounded-md border">
                    <div className="p-4">
                      {analysisResult.static_analysis_report?.issues?.length ? (
                        analysisResult.static_analysis_report.issues.map(
                          (issue, index) => (
                            <div key={index}>
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getSeverityBadge(issue.severity)}
                                    <span className="text-sm font-medium text-muted-foreground">
                                      Line {issue.line > 0 ? issue.line : "N/A"}
                                    </span>
                                  </div>
                                  <p className="text-sm leading-relaxed">
                                    {issue.message}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Check: {issue.check}
                                  </p>
                                </div>
                              </div>
                              {index <
                                analysisResult.static_analysis_report!.issues
                                  .length -
                                  1 && <Separator className="my-4" />}
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-muted-foreground">
                          No static analysis issues found
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Contextual Analysis
                  </h3>
                  <ScrollArea className="h-80 w-full rounded-md border">
                    <div className="p-4">
                      {analysisResult.llm_contextual_report?.findings
                        ?.length ? (
                        analysisResult.llm_contextual_report.findings.map(
                          (finding, index) => (
                            <div key={index}>
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getSeverityBadge(finding.severity)}
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {finding.category}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      Confidence:{" "}
                                      {(finding.confidence * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                  <p className="text-sm leading-relaxed">
                                    {finding.description}
                                  </p>
                                </div>
                              </div>
                              {index <
                                analysisResult.llm_contextual_report!.findings
                                  .length -
                                  1 && <Separator className="my-4" />}
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-muted-foreground">
                          No contextual analysis findings
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Recommendations
                  </h3>
                  <ScrollArea className="h-80 w-full rounded-md border">
                    <div className="p-4">
                      {analysisResult.recommendations?.length ? (
                        analysisResult.recommendations.map((rec, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-start gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {rec.original_check}
                                  </Badge>
                                  <span className="text-sm font-medium text-muted-foreground">
                                    Line{" "}
                                    {rec.line_number > 0
                                      ? rec.line_number
                                      : "N/A"}
                                  </span>
                                </div>
                                <p className="text-sm leading-relaxed mb-2">
                                  {rec.explanation}
                                </p>
                                <div className="bg-muted/50 rounded p-2 mt-2">
                                  <p className="text-xs font-mono text-muted-foreground">
                                    Recommended fix:
                                  </p>
                                  <pre className="text-xs mt-1 whitespace-pre-wrap break-words">
                                    {rec.recommended_code_snippet}
                                  </pre>
                                </div>
                              </div>
                            </div>
                            {index <
                              analysisResult.recommendations!.length - 1 && (
                              <Separator className="my-4" />
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">
                          No recommendations available
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {analysisResult.llm_contextual_report?.executive_summary && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Executive Summary
                  </h3>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed">
                        {analysisResult.llm_contextual_report.executive_summary}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      <Footer />
    </div>
  );
}
