"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AlertCircleIcon, InfoIcon, AlertTriangleIcon, TrendingUp, Loader2 } from "lucide-react"
import { Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

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
    }>,
    error?: string;
  };
  llm_contextual_report?: {
    executive_summary: string;
    overall_risk_grading: string;
    findings: Array<{
      severity: string;
      category: string;
      description: string;
      confidence: number;
    }>,
    error?: string;
  };
}

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<string>("Token")
  const [tokenAddress, setTokenAddress] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.name.endsWith('.sol')) {
      setSelectedFile(file)
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a .sol file",
        variant: "destructive",
      })
    }
  }

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload file')
    }

    return response.json()
  }

  const getContractFromAddress = async (address: string) => {
    const response = await fetch('http://localhost:8000/contract-from-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch contract from address')
    }

    return response.json()
  }

  const analyzeContract = async (contractData: any) => {
    const response = await fetch('http://localhost:8001/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contractData),
    })

    if (!response.ok) {
      throw new Error('Failed to analyze contract')
    }

    return response.json()
  }

  const handleAnalyze = async () => {
    if (selectedOption === "Token" && !tokenAddress.trim()) {
      toast({
        title: "Token address required",
        description: "Please enter a token address",
        variant: "destructive",
      })
      return
    }

    if (selectedOption === "Upload" && !selectedFile) {
      toast({
        title: "File required",
        description: "Please select a .sol file",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      let contractData

      if (selectedOption === "Token") {
        contractData = await getContractFromAddress(tokenAddress)
      } else {
        contractData = await uploadFile(selectedFile!)
      }

      const result = await analyzeContract(contractData)
      setAnalysisResult(result)
      
      toast({
        title: "Analysis completed",
        description: "Smart contract analysis has been completed successfully",
      })
    } catch (error) {
      console.error('Analysis error:', error)
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An error occurred during analysis",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityCounts = () => {
    if (!analysisResult) return { high: 0, medium: 0, low: 0, informational: 0 }

    const counts = { high: 0, medium: 0, low: 0, informational: 0 }

    if (analysisResult.static_analysis_report?.issues) {
      analysisResult.static_analysis_report.issues.forEach(issue => {
        const severity = issue.severity.toLowerCase()
        if (severity === 'informational') counts.informational++
        else if (severity === 'low') counts.low++
        else if (severity === 'medium') counts.medium++
        else if (severity === 'high') counts.high++
      })
    }

    if (analysisResult.llm_contextual_report?.findings) {
      analysisResult.llm_contextual_report.findings.forEach(finding => {
        const severity = finding.severity.toLowerCase()
        if (severity === 'tinggi' || severity === 'high') counts.high++
        else if (severity === 'sedang' || severity === 'medium') counts.medium++
        else if (severity === 'rendah' || severity === 'low') counts.low++
        else if (severity === 'informational' || severity === 'informasional') counts.informational++
      })
    }

    return counts
  }

  const severityCounts = getSeverityCounts()
  const chartData = [
    { severity: "High", count: severityCounts.high, fill: "hsl(var(--destructive))" },
    { severity: "Medium", count: severityCounts.medium, fill: "#f97316" },
    { severity: "Low", count: severityCounts.low, fill: "hsl(var(--secondary))" },
    { severity: "Informational", count: severityCounts.informational, fill: "hsl(var(--muted))" },
  ].filter(item => item.count > 0)

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
  } satisfies ChartConfig

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'tinggi':
      case 'high':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircleIcon className="w-3 h-3" />{severity}</Badge>
      case 'sedang':
      case 'medium':
        return <Badge className="bg-orange-500 text-white flex items-center gap-1"><AlertTriangleIcon className="w-3 h-3" />{severity}</Badge>
      case 'rendah':
      case 'low':
        return <Badge variant="secondary" className="flex items-center gap-1"><InfoIcon className="w-3 h-3" />{severity}</Badge>
      case 'informational':
      case 'informasional':
        return <Badge variant="outline" className="flex items-center gap-1"><InfoIcon className="w-3 h-3" />{severity}</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden font-[family-name:var(--font-geist-sans)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-8 h-8 border border-muted rotate-45"></div>
        <div className="absolute top-32 right-20 w-6 h-6 bg-muted rounded-full"></div>
        <div className="absolute bottom-40 left-20 w-4 h-4 bg-muted"></div>
        <div className="absolute top-60 left-1/4 w-3 h-3 bg-muted rotate-45"></div>
        <div className="absolute bottom-60 right-1/4 w-5 h-5 border border-muted rounded-full"></div>
        <div className="absolute top-40 right-1/3 w-2 h-2 bg-muted"></div>
        <div className="absolute bottom-32 left-1/3 w-6 h-6 border border-muted"></div>
        <div className="absolute top-80 right-10 w-4 h-4 bg-muted rotate-45"></div>
      </div>

      <header className="fixed top-0 w-full px-8 sm:px-20 z-50 flex-shrink-0 bg-background/95 backdrop-blur-lg border-b border-border">
        <nav className="flex items-center justify-between max-w-7xl mx-auto h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">Z</span>
            </div>
            <span className="text-xl font-semibold">Zectra</span>
          </div>

          <NavigationMenu className="hidden md:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  onClick={() => router.push("/")}
                  className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2 text-sm font-medium cursor-pointer"
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  onClick={() => router.push("/#about")}
                  className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2 text-sm font-medium cursor-pointer"
                >
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  onClick={() => router.push("/#services")}
                  className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2 text-sm font-medium cursor-pointer"
                >
                  Service
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2 text-sm font-medium"
                >
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button variant="outline" className="font-medium text-sm h-10 px-4 bg-transparent">
              Sign In
            </Button>
          </div>
        </nav>
      </header>

      <div className="w-full max-w-6xl mx-auto px-4 py-8 mt-20 relative z-20">
        <div className="grid gap-8 md:grid-cols-2">
          <Card id="input-section" className="w-full relative z-30">
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>
                Enter your smart contract 
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="w-full">
                  <Select value={selectedOption} onValueChange={setSelectedOption}>
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
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Contract"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Chart Section */}
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
                Total Issues Found: {chartData.reduce((sum, item) => sum + item.count, 0)} <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground leading-none">
                {analysisResult ? "Security analysis completed" : "Waiting for analysis"}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {analysisResult && (
        <section id="result" className="w-full max-w-6xl mx-auto px-4 py-8 relative z-20">
          <Card className="w-full relative z-30">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Analysis Results</CardTitle>
                  <CardDescription>
                    Smart contract security analysis for {analysisResult.metadata.token_address ? `token: ${analysisResult.metadata.token_address}` : `file: ${analysisResult.metadata.file_path}`}
                  </CardDescription>
                </div>
                {analysisResult.llm_contextual_report?.overall_risk_grading && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Overall Risk:</span>
                    {getSeverityBadge(analysisResult.llm_contextual_report.overall_risk_grading)}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Static Analysis Issues</h3>
                  <ScrollArea className="h-80 w-full rounded-md border">
                    <div className="p-4">
                      {analysisResult.static_analysis_report?.issues?.length ? (
                        analysisResult.static_analysis_report.issues.map((issue, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-start gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {getSeverityBadge(issue.severity)}
                                  <span className="text-sm font-medium text-muted-foreground">
                                    Line {issue.line > 0 ? issue.line : 'N/A'}
                                  </span>
                                </div>
                                <p className="text-sm leading-relaxed">{issue.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">Check: {issue.check}</p>
                              </div>
                            </div>
                            {index < analysisResult.static_analysis_report!.issues.length - 1 && (
                              <Separator className="my-4" />
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No static analysis issues found</p>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Contextual Analysis</h3>
                  <ScrollArea className="h-80 w-full rounded-md border">
                    <div className="p-4">
                      {analysisResult.llm_contextual_report?.findings?.length ? (
                        analysisResult.llm_contextual_report.findings.map((finding, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-start gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {getSeverityBadge(finding.severity)}
                                  <Badge variant="outline" className="text-xs">
                                    {finding.category}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    Confidence: {(finding.confidence * 100).toFixed(0)}%
                                  </span>
                                </div>
                                <p className="text-sm leading-relaxed">{finding.description}</p>
                              </div>
                            </div>
                            {index < analysisResult.llm_contextual_report!.findings.length - 1 && (
                              <Separator className="my-4" />
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No contextual analysis findings</p>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {analysisResult.llm_contextual_report?.executive_summary && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Executive Summary</h3>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed">{analysisResult.llm_contextual_report.executive_summary}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

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
  )
}

