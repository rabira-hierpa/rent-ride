interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  data?: {
    message?: string;
  };
  message?: string;
  toString: () => string;
}

export const formatErrorMessage = (error: ErrorResponse, fallback?: string) => {
  return (
    (error?.response && error.response?.data && error.response.data?.message) ||
    error?.data?.message ||
    error?.message ||
    error?.toString() ||
    fallback ||
    "ERROR OCCURRED"
  );
};
