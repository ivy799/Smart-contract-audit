import React from "react";

const Background = () => {
  return (
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
  );
};

export default Background;
