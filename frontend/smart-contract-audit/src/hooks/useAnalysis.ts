import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { AnalysisResult, AnalysisStep } from "@/types/analysis";
import {
  uploadFile,
  getContractFromAddress,
  performStaticAnalysis,
  performLlmAnalysis,
  generateRecommendations,
} from "@/services/analysisService";

export const useAnalysis = () => {
  const { isSignedIn, user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep>("idle");
  const [staticAnalysisResult, setStaticAnalysisResult] = useState<any>(null);
  const [llmAnalysisResult, setLlmAnalysisResult] = useState<any>(null);

  const performAnalysis = async (
    selectedOption: string,
    tokenAddress: string,
    selectedFile: File | null,
    usageCount: number,
    maxUsage: number,
    incrementUsage: () => number
  ) => {
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

      const newUsageCount = incrementUsage();

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

  return {
    isLoading,
    analysisResult,
    analysisStep,
    staticAnalysisResult,
    llmAnalysisResult,
    performAnalysis,
  };
};
