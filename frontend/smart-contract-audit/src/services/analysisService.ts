export const uploadFile = async (file: File) => {
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

export const getContractFromAddress = async (address: string) => {
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

export const performStaticAnalysis = async (contractData: any) => {
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

export const performLlmAnalysis = async (contractData: any) => {
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

export const generateRecommendations = async (staticAnalysisData: any) => {
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
