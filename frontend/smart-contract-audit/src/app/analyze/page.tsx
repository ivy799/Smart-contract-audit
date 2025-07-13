"use client";

import { Button } from "@/components/ui/button";
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
import { TrendingUp, Loader2 } from "lucide-react";
import { Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Background from "../components/Background";
import { AnalysisResult } from "@/types/analysis";
import { getSeverityBadge } from "@/components/ui/SeverityBadge";
import { useUsageTracking } from "@/hooks/useUsageTracking";
import { useAnalysis } from "@/hooks/useAnalysis";
import { getSeverityCounts, createChartData, getAnalysisStepText } from "@/utils/analysisUtils";
import { chartConfig } from "@/config/chartConfig";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const [selectedOption, setSelectedOption] = useState<string>("Token");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [maxUsage] = useState<number>(5);
  const router = useRouter();
  const { toast } = useToast();

  // hooks
  const { usageCount, incrementUsage, hasReachedLimit, remainingUsage } = useUsageTracking(maxUsage);
  const { isLoading, analysisResult, analysisStep, performAnalysis } = useAnalysis();

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

  // dari useAnalysis.ts
  const handleAnalyze = async () => {
    await performAnalysis(
      selectedOption,
      tokenAddress,
      selectedFile,
      usageCount,
      maxUsage,
      incrementUsage
    );
  };

  // dari analysisUtils.ts
  const severityCounts = getSeverityCounts(analysisResult);
  const chartData = createChartData(severityCounts);

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

        <Navbar />

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

        <Footer />
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
                Enter your smart contract ({remainingUsage} analyses
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
                disabled={isLoading || hasReachedLimit}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {getAnalysisStepText(analysisStep)}
                  </>
                ) : hasReachedLimit ? (
                  "Usage Limit Reached"
                ) : (
                  "Analyze Contract"
                )}
              </Button>
              {hasReachedLimit && (
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
