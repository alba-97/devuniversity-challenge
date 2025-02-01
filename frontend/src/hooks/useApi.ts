import { useState, useCallback } from "react";

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export const useApi = <T = any>(baseUrl: string) => {
  const [response, setResponse] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const fetchData = useCallback(
    async (
      endpoint: string,
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
      body?: any
    ) => {
      setResponse((prev) => ({ ...prev, loading: true }));

      try {
        const token = localStorage.getItem("token");
        const headers: HeadersInit = {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        };

        const config: RequestInit = {
          method,
          headers,
          ...(body && { body: JSON.stringify(body) }),
        };

        const res = await fetch(`${baseUrl}${endpoint}`, config);

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "An error occurred");
        }

        const data = await res.json();
        setResponse({
          data,
          error: null,
          loading: false,
        });

        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        setResponse({
          data: null,
          error: errorMessage,
          loading: false,
        });

        throw error;
      }
    },
    [baseUrl]
  );

  const get = useCallback(
    (endpoint: string) => fetchData(endpoint, "GET"),
    [fetchData]
  );

  const post = useCallback(
    (endpoint: string, body: any) => fetchData(endpoint, "POST", body),
    [fetchData]
  );

  const put = useCallback(
    (endpoint: string, body: any) => fetchData(endpoint, "PUT", body),
    [fetchData]
  );

  const patch = useCallback(
    (endpoint: string, body: any) => fetchData(endpoint, "PATCH", body),
    [fetchData]
  );

  const del = useCallback(
    (endpoint: string) => fetchData(endpoint, "DELETE"),
    [fetchData]
  );

  const resetState = useCallback(() => {
    setResponse({
      data: null,
      error: null,
      loading: false,
    });
  }, []);

  return {
    fetchData,
    get,
    post,
    put,
    patch,
    del,
    resetState,
    ...response,
  };
};
