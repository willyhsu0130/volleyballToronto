import React from "react";

interface ApiResultProps {
  status?: "idle" | "loading" | "success" | "error";
  message?: string;
}

export const ApiResult: React.FC<ApiResultProps> = ({ status = "idle", message }) => {
  console.log("status", status)
  if (status === "idle") return null;

  const colorMap = {
    loading: "text-blue-500",
    success: "text-green-500",
    error: "text-red-500",
  } as const;

  const text = {
    loading: "Loading...",
    success: message || "Success!",
    error: message || "Something went wrong",
  }[status];

  return (
    <p className={`text-sm font-medium mt-2 ${colorMap[status]}`}>
      {text}
    </p>
  );
};